import { Gutter } from '@components/Gutter';
import { Typography } from '@components/Typography';

interface Props {
  title: string;
  subtitle: string;
}

export const UserSettingsModalSectionText = ({ title, subtitle }: Props) => {
  return (
    <>
      <Typography
        fontSize="lg"
        fontWeight="semiBold"
      >
        {title}
      </Typography>
      <Gutter height={6} />
      <Typography
        color="textSecondary"
        fontSize="sm"
        lineHeight="lg"
      >
        {subtitle}
      </Typography>
      <Gutter height={16} />
    </>
  );
};
