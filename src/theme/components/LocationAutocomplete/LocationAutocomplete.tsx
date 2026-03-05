import { useEffect, useRef, useCallback } from 'react'
import { TextInput, type TextInputProps } from '@mantine/core'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import './LocationAutocomplete.css'

interface LocationAutocompleteProps extends TextInputProps {
  onChange?: (value: string) => void
}

export function LocationAutocomplete({
  onChange,
  ...rest
}: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const places = useMapsLibrary('places')

  useEffect(() => {
    if (!places || !inputRef.current) return

    const autocomplete = new places.Autocomplete(inputRef.current, {
      types: ['(cities)'],
      fields: ['formatted_address'],
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (place.formatted_address) {
        onChangeRef.current?.(place.formatted_address)
      }
    })

    autocompleteRef.current = autocomplete

    return () => {
      google.maps.event.clearInstanceListeners(autocomplete)
      autocompleteRef.current = null
    }
  }, [places])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeRef.current?.(e.currentTarget.value)
    },
    [],
  )

  return (
    <div className="location-autocomplete-wrapper">
      <TextInput ref={inputRef} onChange={handleChange} {...rest} />
    </div>
  )
}
