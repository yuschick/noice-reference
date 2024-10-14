import { useReportReason } from '../context';

import { Button } from '@common-components';

export function ReportDialogActions() {
  const {
    isReasonListVisible,
    onBackClick,
    onNextClick,
    showBackButton,
    isNextButtonDisabled,
    onSubmit,
  } = useReportReason();

  if (isReasonListVisible) {
    return (
      <>
        {showBackButton && (
          <Button
            level="secondary"
            theme="dark"
            onClick={onBackClick}
          >
            Back
          </Button>
        )}
        <Button
          isDisabled={isNextButtonDisabled}
          theme="dark"
          onClick={onNextClick}
        >
          Next
        </Button>
      </>
    );
  }

  return (
    <>
      <Button
        level="secondary"
        theme="dark"
        onClick={onBackClick}
      >
        Back
      </Button>

      <Button
        theme="dark"
        onClick={onSubmit}
      >
        Next
      </Button>
    </>
  );
}
