import { useState, useRef, useEffect, useCallback } from "react";
import { Combobox, TextInput, Loader, useCombobox } from "@mantine/core";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import type { TextInputProps } from "@mantine/core";
import "./LocationAutocomplete.css";

type LocationAutocompleteProps = Omit<TextInputProps, "onChange"> & {
  onChange?: (value: string) => void;
};

const DEBOUNCE_MS = 300;

export function LocationAutocomplete({
  onChange,
  value,
  ...rest
}: LocationAutocompleteProps) {
  const places = useMapsLibrary("places");
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [inputValue, setInputValue] = useState(
    typeof value === "string" ? value : "",
  );
  const [predictions, setPredictions] = useState<
    google.maps.places.PlacePrediction[]
  >([]);
  const [loading, setLoading] = useState(false);

  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    if (typeof value === "string" && value !== inputValue) {
      setInputValue(value);
    }
  }, [value, inputValue]);

  const getSessionToken = useCallback(() => {
    if (!places) return null;
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new places.AutocompleteSessionToken();
    }
    return sessionTokenRef.current;
  }, [places]);

  const resetSession = useCallback(() => {
    sessionTokenRef.current = null;
  }, []);

  const fetchSuggestions = useCallback(
    async (input: string) => {
      if (!places || input.length < 2) {
        setPredictions([]);
        return;
      }

      setLoading(true);

      try {
        const { AutocompleteSuggestion } = places;
        const { suggestions } =
          await AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input,
            includedPrimaryTypes: ["(cities)"],
            sessionToken: getSessionToken() ?? undefined,
            language: "en-US",
          });

        const placePredictions = suggestions
          .map((s) => s.placePrediction)
          .filter(
            (p): p is google.maps.places.PlacePrediction => p !== null,
          );

        setPredictions(placePredictions);
      } catch {
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    },
    [places, getSessionToken],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.currentTarget.value;
      setInputValue(val);
      onChangeRef.current?.(val);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (val.length < 2) {
        setPredictions([]);
        combobox.closeDropdown();
        return;
      }

      debounceRef.current = setTimeout(() => {
        fetchSuggestions(val);
        combobox.openDropdown();
      }, DEBOUNCE_MS);
    },
    [fetchSuggestions, combobox],
  );

  const handleOptionSubmit = useCallback(
    async (predictionIndex: string) => {
      const index = Number(predictionIndex);
      const prediction = predictions[index];
      if (!prediction) return;

      const place = prediction.toPlace();
      await place.fetchFields({ fields: ["formattedAddress"] });

      const address = place.formattedAddress ?? prediction.text.text;
      setInputValue(address);
      onChangeRef.current?.(address);
      setPredictions([]);
      combobox.closeDropdown();
      resetSession();
    },
    [predictions, combobox, resetSession],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const options = predictions.map((prediction, index) => (
    <Combobox.Option value={String(index)} key={prediction.placeId}>
      <span className="location-option-main">
        {prediction.mainText?.text}
      </span>
      {prediction.secondaryText?.text && (
        <span className="location-option-secondary">
          {prediction.secondaryText.text}
        </span>
      )}
    </Combobox.Option>
  ));

  return (
    <Combobox store={combobox} onOptionSubmit={handleOptionSubmit}>
      <Combobox.Target>
        <TextInput
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (predictions.length > 0) combobox.openDropdown();
          }}
          onBlur={() => combobox.closeDropdown()}
          rightSection={loading ? <Loader size={16} /> : null}
          {...rest}
        />
      </Combobox.Target>

      <Combobox.Dropdown hidden={predictions.length === 0}>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
