import { View } from 'react-native';

import { Gutter } from '@components/Gutter';
import { TextArea } from '@components/TextArea';
import { Typography } from '@components/Typography';

type Props = {
  selectedReason: string;
  additionalDetails?: string;
  setAdditionalDetails: (details: string) => void;
};

export const Details = ({
  selectedReason,
  additionalDetails,
  setAdditionalDetails,
}: Props) => {
  const onChangeText = (text: string) => {
    setAdditionalDetails(text);
  };

  return (
    <View>
      <Typography
        fontSize="md"
        fontWeight="regular"
        lineHeight="xl"
      >
        Almost ready to submit your report about &quot;{selectedReason}&quot; you saw on
        channel chat. Is there anything else we should know as we review your report?
      </Typography>
      <Gutter height={24} />
      <TextArea
        maxLength={500}
        numberOfLines={5}
        placeholder="Type here"
        value={additionalDetails}
        multiline
        onChangeText={onChangeText}
      />
    </View>
  );
};
