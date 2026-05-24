import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

export type SelectOption = {
  value: string
  label: string
}

type SelectFieldProps = {
  label: string
  labelId: string
  value: string
  options: SelectOption[]
  disabled?: boolean
  onChange: (value: string) => void
}

export function SelectField({
  label,
  labelId,
  value,
  options,
  disabled = false,
  onChange,
}: SelectFieldProps) {
  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
