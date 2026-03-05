import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Container,
  Button,
  TextInput,
  NumberInput,
  Select,
  Checkbox,
  Stepper,
  Title,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { InfoTooltip } from "@/theme/components/InfoTooltip/InfoTooltip";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import {
  searchCriteriaSchema,
  monitoringSettingsSchema,
  type SearchCriteria,
  type MonitoringSettings,
  type NotificationMethod,
} from "@/features/search/search.types";
import type { ActiveSearch } from "@/features/search/search.types";
import {
  useCreateSearch,
  useUpdateSearch,
} from "@/features/search/hooks/search.hook";
import '@/features/search/page/NewSearchPage/NewSearchPage.css'

const DATE_LISTED_OPTIONS = [
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

const FREQUENCY_OPTIONS = [
  { value: "Every 30 minutes", label: "Every 30 minutes" },
  { value: "Every hour", label: "Every hour" },
  { value: "Every 2 hours", label: "Every 2 hours" },
  { value: "Every 6 hours", label: "Every 6 hours" },
  { value: "Every 12 hours", label: "Every 12 hours" },
  { value: "Daily", label: "Daily" },
];

interface SearchFormProps {
  existingSearch?: ActiveSearch;
}

export function SearchForm({ existingSearch }: SearchFormProps) {
  const navigate = useNavigate();
  const isEditing = !!existingSearch;

  const createMutation = useCreateSearch();
  const updateMutation = useUpdateSearch();

  const [step, setStep] = useState(0);

  const criteriaForm = useForm<SearchCriteria>({
    mode: "controlled",
    initialValues: {
      query: existingSearch?.criteria.query ?? "",
      location: existingSearch?.criteria.location ?? "",
      minPrice: existingSearch?.criteria.minPrice ?? "",
      maxPrice: existingSearch?.criteria.maxPrice ?? "",
      dateListed: existingSearch?.criteria.dateListed ?? "7d",
    },
    validate: zod4Resolver(searchCriteriaSchema),
  });

  const settingsForm = useForm<MonitoringSettings>({
    mode: "controlled",
    initialValues: {
      frequency: existingSearch?.settings.frequency ?? "",
      listingsPerCheck: existingSearch?.settings.listingsPerCheck ?? 1,
      notifications: existingSearch?.settings.notifications ?? [],
    },
    validate: zod4Resolver(monitoringSettingsSchema),
  });

  const handleNext = () => {
    if (step === 0) {
      const result = criteriaForm.validate();
      if (result.hasErrors) return;
      setStep(1);
    } else {
      const result = settingsForm.validate();
      if (result.hasErrors) return;

      const payload = {
        criteria: criteriaForm.values,
        settings: settingsForm.values,
      };

      if (isEditing && existingSearch) {
        updateMutation.mutate(
          { body: payload, path: { id: existingSearch.id } },
          { onSuccess: () => navigate("/") },
        );
      } else {
        createMutation.mutate(
          { body: payload },
          { onSuccess: () => navigate("/") },
        );
      }
    }
  };

  const handleBack = () => {
    if (step === 1) {
      setStep(0);
    } else {
      navigate("/");
    }
  };

  const toggleNotification = (method: NotificationMethod) => {
    const current = settingsForm.values.notifications;
    const updated = current.includes(method)
      ? current.filter((n: NotificationMethod) => n !== method)
      : [...current, method];
    settingsForm.setFieldValue("notifications", updated);
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <Container size="sm" className="new-search-container">
      <div className="new-search-stepper">
        <Stepper active={step} color="amber" size="sm">
          <Stepper.Step label="Search Criteria" />
          <Stepper.Step label="Monitoring" />
        </Stepper>
      </div>

      <Title order={1} className="new-search-title">
        {step === 0 ? "Search Criteria" : "Monitoring Settings"}
      </Title>

      <div className="new-search-form-card">
        {step === 0 ? (
          <Stack gap="lg">
            <TextInput
              label="Search Query"
              placeholder="e.g., Fender Stratocaster"
              key={criteriaForm.key("query")}
              {...criteriaForm.getInputProps("query")}
            />
            <TextInput
              label="Location"
              placeholder="e.g., San Francisco, CA"
              key={criteriaForm.key("location")}
              {...criteriaForm.getInputProps("location")}
            />
            <Group grow>
              <TextInput
                label={
                  <span>
                    Min Price{" "}
                    <Text span size="xs" c="dimmed">
                      (optional)
                    </Text>
                  </span>
                }
                type="number"
                placeholder="No minimum"
                key={criteriaForm.key("minPrice")}
                {...criteriaForm.getInputProps("minPrice")}
              />
              <TextInput
                label={
                  <span>
                    Max Price{" "}
                    <Text span size="xs" c="dimmed">
                      (optional)
                    </Text>
                  </span>
                }
                type="number"
                placeholder="No maximum"
                key={criteriaForm.key("maxPrice")}
                {...criteriaForm.getInputProps("maxPrice")}
              />
            </Group>
            <Select
              label="Date Listed"
              data={DATE_LISTED_OPTIONS}
              key={criteriaForm.key("dateListed")}
              {...criteriaForm.getInputProps("dateListed")}
            />
          </Stack>
        ) : (
          <Stack gap="lg">
            <Select
              label="Search Frequency"
              placeholder="Select frequency"
              data={FREQUENCY_OPTIONS}
              key={settingsForm.key("frequency")}
              {...settingsForm.getInputProps("frequency")}
            />
            <NumberInput
              label={
                <span>
                  Pages to Fetch
                  <InfoTooltip label="Number of pages to retrieve from Facebook Marketplace. Each page contains up to 24 listings. Max 10 pages (240 listings)." />
                </span>
              }
              min={1}
              max={10}
              clampBehavior="strict"
              key={settingsForm.key("listingsPerCheck")}
              {...settingsForm.getInputProps("listingsPerCheck")}
            />
            <div>
              <Text size="sm" fw={500} mb="xs">
                Notifications{" "}
                <Text span size="xs" c="dimmed">
                  (optional)
                </Text>
              </Text>
              <Stack gap="sm">
                <Checkbox
                  label="Email"
                  checked={settingsForm.values.notifications.includes("email")}
                  onChange={() => toggleNotification("email")}
                />
                <Checkbox
                  label="SMS"
                  checked={settingsForm.values.notifications.includes("sms")}
                  onChange={() => toggleNotification("sms")}
                />
                <Checkbox
                  label="Webhook"
                  checked={settingsForm.values.notifications.includes(
                    "webhook",
                  )}
                  onChange={() => toggleNotification("webhook")}
                />
              </Stack>
            </div>
          </Stack>
        )}
      </div>

      <Group gap="sm" mt="lg">
        <Button
          variant="outline"
          color="gray"
          onClick={handleBack}
          leftSection={<IconArrowLeft size={16} />}
          disabled={isMutating}
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          color="amber"
          rightSection={step === 0 ? <IconArrowRight size={16} /> : undefined}
          className="new-search-submit"
          loading={isMutating}
        >
          {step === 0 ? "Next" : isEditing ? "Update Search" : "Create Search"}
        </Button>
      </Group>
    </Container>
  );
}
