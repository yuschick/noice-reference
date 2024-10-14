import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  countries,
  Anchor,
  Button,
  Callout,
  Checkbox,
  InputField,
  RadioButton,
  Select,
  SelectOption,
  LoadingSpinner,
} from '@noice-com/common-ui';
import { FormEvent, useId, useState } from 'react';

import styles from './AgreementForm.module.css';
import { supportedCountryCodes } from './supportedCountryCodes';

import { useChannelContext } from '@common/channel';
import { PageHeading } from '@common/layout';
import {
  ChannelGender,
  useSubmitMonetizationAgreementMutation,
  ChannelProviderDataDocument,
} from '@gen';

gql`
  mutation SubmitMonetizationAgreement(
    $channelId: ID
    $firstName: String
    $lastName: String
    $address: APIAddressInput
    $birthday: APIDateInput
    $gender: ChannelGender
  ) {
    acceptMonetizationTerms(
      channelId: $channelId
      firstName: $firstName
      lastName: $lastName
      address: $address
      birthday: $birthday
      gender: $gender
    ) {
      emptyTypeWorkaround
    }
  }
`;

const TOS_URL =
  'https://legal.noice.com/hc/en-us/articles/21060566696221-Monetization-Agreement';

const countryOptions: SelectOption[] = [
  { value: '', label: 'Select country', type: 'option' },
  ...countries
    .filter((country) => supportedCountryCodes.includes(country.value))
    .map<SelectOption>((country) => ({
      value: country.value,
      label: country.label,
      type: 'option',
    })),
];

export function AgreementForm() {
  const [hasFormError, setHasFormError] = useState(false);
  const genderLabelId = useId();
  const genderDescriptionId = useId();
  const { channelId } = useChannelContext();

  const [submitMonetizationAgreementMutation, { loading }] =
    useSubmitMonetizationAgreementMutation({
      awaitRefetchQueries: true,
      refetchQueries: [ChannelProviderDataDocument, 'ChannelProviderData'],
    });

  const getMaxDateOfBirth = () => {
    const now = new Date();
    const maxDate = now.setFullYear(now.getFullYear() - 18);

    return new Date(maxDate).toISOString().split('T')[0];
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const address = {
      address: formData.get('street') as string,
      city: formData.get('city') as string,
      zip: formData.get('zip') as string,
      country: formData.get('country') as string,
    };

    const birthDate = new Date(formData.get('dob') as string);
    const dob = {
      day: birthDate.getDate(),
      month: birthDate.getMonth() + 1,
      year: birthDate.getFullYear(),
    };

    try {
      setHasFormError(false);
      await submitMonetizationAgreementMutation({
        variables: {
          address,
          birthday: dob,
          channelId,
          firstName: formData.get('first-name') as string,
          gender: formData.get('gender') as ChannelGender,
          lastName: formData.get('last-name') as string,
        },
      });
    } catch (error) {
      setHasFormError(!!error);
    }
  };

  return (
    <>
      <Callout
        message="Your channel is eligible for monetization. Sign the monetization agreement to enable monetization."
        slots={{
          icon: CoreAssets.Icons.CheckCircle,
        }}
        theme="gray"
        type="success"
        variant="bordered"
      />

      <PageHeading
        headingLevel="h2"
        title="Monetization Agreement"
      />

      <article className={styles.agreementWrapper}>
        <div className={styles.agreementDetailsWrapper}>
          <p>
            To be able to monetize your channel, enable payout of your channel&apos;s
            earnings and to adhere to legal requirements, we need to collect some of your
            personal information below.
          </p>
          <div className={styles.agreementLinkWrapper}>
            <Anchor
              href={TOS_URL}
              showExternalLinkIcon
            >
              Monetization Agreement
            </Anchor>
          </div>
        </div>

        <form
          className={styles.formWrapper}
          onSubmit={handleSubmit}
        >
          {loading && (
            <div className={styles.loadingWrapper}>
              <LoadingSpinner />
            </div>
          )}

          <InputField
            label="First name(s)"
            labelType="fixed"
            name="first-name"
            placeholder="Name(s)"
            theme="gray"
            required
          />
          <InputField
            label="Last name(s)"
            labelType="fixed"
            name="last-name"
            placeholder="Name(s)"
            theme="gray"
            required
          />
          <InputField
            label="Street address"
            labelType="fixed"
            name="street"
            placeholder="Address"
            theme="gray"
            required
          />
          <InputField
            label="City"
            labelType="fixed"
            name="city"
            placeholder="City"
            theme="gray"
            required
          />
          <InputField
            label="ZIP/Postal code"
            labelType="fixed"
            maxLength={10}
            name="zip"
            placeholder="00000"
            theme="gray"
            required
          />
          <Select
            label="Country"
            name="country"
            options={countryOptions}
            theme="gray"
            required
          />
          <InputField
            label="Birth date"
            labelType="fixed"
            max={getMaxDateOfBirth()}
            name="dob"
            theme="gray"
            type="date"
            required
          />

          <div
            aria-describedby={genderDescriptionId}
            aria-labelledby={genderLabelId}
            className={styles.genderWrapper}
            role="radiogroup"
          >
            <span
              className={styles.label}
              id={genderLabelId}
            >
              Gender
            </span>
            <p id={genderDescriptionId}>
              Under Finnish tax law, we&apos;re required to collect and report the gender
              of a payee to Finnish tax authorities, recognizing only &quot;male&quot; or
              &quot;female&quot; options as per 2023 legislation.{' '}
              <span className={styles.emphasisText}>
                This data is solely for tax reporting purposes.
              </span>
            </p>
            <RadioButton
              label="Female"
              name="gender"
              value={ChannelGender.GenderFemale}
              required
            />
            <RadioButton
              label="Male"
              name="gender"
              value={ChannelGender.GenderMale}
              required
            />
          </div>

          <div>
            <Checkbox
              label="I have read and agree with and accept all of the terms and conditions of the monetization agreement."
              name="tos"
              value="tos"
              required
            />
          </div>

          <Button
            type="submit"
            variant="cta"
          >
            Sign Monetization Agreement
          </Button>

          {hasFormError && (
            <Callout
              message="An error occurred while submitting the form. Please ensure all the fields are correct and try again."
              type="error"
              variant="bordered"
              isLive
            />
          )}
        </form>
      </article>
    </>
  );
}
