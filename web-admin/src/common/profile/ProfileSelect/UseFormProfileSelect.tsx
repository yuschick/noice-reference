import { useController } from 'react-hook-form';

import { ProfileSelectWrapper as ProfileSelect } from './ProfileSelectWrapper';

interface Props {
  label: string;
  name: string;
  hasError?: boolean;
}

export function UseFormProfileSelect({ label, name, hasError }: Props) {
  const { field } = useController({
    name,
    rules: { required: true },
  });

  const onSelect = (userId: string) => {
    field.onChange(userId);
  };

  return (
    <ProfileSelect
      hasError={hasError}
      label={label}
      onBlur={field.onBlur}
      onSelect={onSelect}
    />
  );
}
