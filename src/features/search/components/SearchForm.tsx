import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Container,
  Button,
  TextInput,
  NumberInput,
  Select,
  Stepper,
  Title,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { InfoTooltip } from "@/theme/components/InfoTooltip/InfoTooltip";
import { LocationAutocomplete } from "@/theme/components/LocationAutocomplete/LocationAutocomplete";
import { useForm, type FormValidateInput } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import {
  searchFormSchema,
  type SearchFormValues,
} from "@/features/search/search.types";
import type { ActiveSearch } from "@/features/search/search.types";
import {
  useCreateSearch,
  useUpdateSearch,
} from "@/features/search/hooks/search.hook";
import { useAuth } from "@/features/auth/hooks/auth.hook";
import "@/features/search/page/NewSearchPage/NewSearchPage.css";

const DATE_LISTED_OPTIONS = [
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

const FREQUENCY_OPTIONS = [
  { value: "every_1h", label: "Every hour" },
  { value: "every_2h", label: "Every 2 hours" },
  { value: "every_6h", label: "Every 6 hours" },
  { value: "every_12h", label: "Every 12 hours" },
  { value: "every_24h", label: "Every 24 hours" },
];

const NOTIFICATION_TYPE_OPTIONS = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "webhook", label: "Webhook" },
];

interface SearchFormProps {
  existingSearch?: ActiveSearch;
}

export function SearchForm({ existingSearch }: SearchFormProps) {
  const navigate = useNavigate();
  const { email } = useAuth();
  const isEditing = !!existingSearch;

  const createMutation = useCreateSearch();
  const updateMutation = useUpdateSearch();

  const [step, setStep] = useState(0);

  const form = useForm<SearchFormValues>({
    mode: "controlled",
    initialValues: {
      query: existingSearch?.query ?? "",
      location: existingSearch?.location ?? "",
      minPrice: existingSearch?.minPrice != null ? String(existingSearch.minPrice) : "",
      maxPrice: existingSearch?.maxPrice != null ? String(existingSearch.maxPrice) : "",
      dateListed: existingSearch?.dateListed ?? "7d",
      frequency: existingSearch?.frequency ?? "every_1h",
      listingsPerCheck: existingSearch?.listingsPerCheck ?? 1,
      notificationType: existingSearch?.notificationType ?? "email",
      notificationTarget: existingSearch?.notificationTarget
        ?? (existingSearch ? "" : email ?? ""),
    },
    validate: zod4Resolver(searchFormSchema) as FormValidateInput<SearchFormValues>,
  });

  const previousTypeRef = useRef(form.values.notificationType);

  useEffect(() => {
    const currentType = form.values.notificationType;
    if (previousTypeRef.current !== currentType) {
      if (currentType === "email") {
        form.setFieldValue("notificationTarget", email ?? "");
      } else {
        form.setFieldValue("notificationTarget", "");
      }
      previousTypeRef.current = currentType;
    }
  }, [form.values.notificationType, email]);

  const handleNext = () => {
    if (step === 0) {
      const result = form.validateField("query");
      const locResult = form.validateField("location");
      if (result.hasError || locResult.hasError) return;
      setStep(1);
    } else {
      const result = form.validate();
      if (result.hasErrors) return;

      const values = form.values;
      const payload = {
        query: values.query,
        location: values.location,
        minPrice: values.minPrice ? Number(values.minPrice) : undefined,
        maxPrice: values.maxPrice ? Number(values.maxPrice) : null,
        dateListed: values.dateListed,
        frequency: values.frequency,
        listingsPerCheck: values.listingsPerCheck,
        notificationType: values.notificationType,
        notificationTarget: values.notificationTarget,
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
              key={form.key("query")}
              {...form.getInputProps("query")}
            />
            <LocationAutocomplete
              label="Location"
              placeholder="e.g., San Francisco, CA"
              key={form.key("location")}
              {...form.getInputProps("location")}
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
                key={form.key("minPrice")}
                {...form.getInputProps("minPrice")}
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
                key={form.key("maxPrice")}
                {...form.getInputProps("maxPrice")}
              />
            </Group>
            <Select
              label="Date Listed"
              data={DATE_LISTED_OPTIONS}
              key={form.key("dateListed")}
              {...form.getInputProps("dateListed")}
            />
          </Stack>
        ) : (
          <Stack gap="lg">
            <Select
              label="Search Frequency"
              placeholder="Select frequency"
              data={FREQUENCY_OPTIONS}
              key={form.key("frequency")}
              {...form.getInputProps("frequency")}
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
              key={form.key("listingsPerCheck")}
              {...form.getInputProps("listingsPerCheck")}
            />
            <Select
              label="Notification Type"
              data={NOTIFICATION_TYPE_OPTIONS}
              key={form.key("notificationType")}
              {...form.getInputProps("notificationType")}
            />
            <TextInput
              label={
                form.values.notificationType === "email"
                  ? "Email address"
                  : form.values.notificationType === "sms"
                    ? "Phone number"
                    : "Webhook URL"
              }
              placeholder={
                form.values.notificationType === "email"
                  ? "you@example.com"
                  : form.values.notificationType === "sms"
                    ? "+1 234 567 8900"
                    : "https://your-webhook.com/endpoint"
              }
              key={form.key("notificationTarget")}
              {...form.getInputProps("notificationTarget")}
            />
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
