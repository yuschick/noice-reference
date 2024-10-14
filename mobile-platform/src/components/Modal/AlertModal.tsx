import { DefaultModal } from './DefaultModal';
import { DefaultModalProps } from './DefaultModal/DefaultModal';

import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { Typography } from '@components/Typography';

interface AlertAction {
  label: string;
  onPress: () => void;
}

interface AlertModalProps extends DefaultModalProps {
  title: string;
  content: string;
  action: AlertAction;
}

export const AlertModal = ({
  title,
  content,
  action,
  onClose,
  ...rest
}: AlertModalProps) => {
  return (
    <DefaultModal
      onClose={onClose}
      {...rest}
    >
      <Typography
        fontSize="xxl"
        fontWeight="extraBold"
        uppercase
      >
        {title}
      </Typography>
      <Gutter height={16} />
      <Typography
        color="textSecondary"
        fontSize="lg"
      >
        {content}
      </Typography>
      <Gutter height={32} />
      <ButtonLarge
        backgroundColor={['green500', 'teal500']}
        textColor="darkMain"
        onPress={action.onPress}
      >
        {action.label}
      </ButtonLarge>
      <Gutter height={8} />
      {!!onClose && <ButtonLarge onPress={onClose}>Close</ButtonLarge>}
    </DefaultModal>
  );
};
