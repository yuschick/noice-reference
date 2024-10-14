/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useClient } from '@noice-com/common-react-core';
import { Button, TextArea, usePromiseCreator } from '@noice-com/common-ui';
import { IdentityType } from '@noice-com/schemas/auth/auth.pb';
import { makeLoggers, Nullable } from '@noice-com/utils';
import { FormEvent, useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import styles from './PartyAdmin.module.css';

import { useAfterAuth } from '@common/auth';

const { logError } = makeLoggers('PARTY ADMIN');

export function PartyAdmin() {
  const [emails, setEmails] = useState<string>('');
  const [error, setError] = useState<Nullable<string>>(null);
  const client = useClient();

  const fetchParties = useCallback(async () => {
    const parties = await client.PartyAdminService.listParties();
    const memberIds = parties
      .map((party) => party.members)
      .flat()
      .map((m) => m!.userId!);
    const accounts = await client.AuthAdminService.getAccounts(memberIds);
    const accountById = Object.fromEntries(accounts.map((a) => [a.uid!, a]));
    const invitations = await client.AuthAdminService.getInvitations(memberIds);
    const invitationById = Object.fromEntries(
      invitations.map((inv) => [inv.userId!, inv]),
    );

    const partiesWithEmails = parties.map((party) => ({
      id: party.id!,
      emails: party.members!.map((m) => {
        const uid = m!.userId!;

        return (
          accountById[uid]?.email ||
          invitationById[uid]?.identities?.find(
            ({ type }) => type === IdentityType.IDENTITY_TYPE_EMAIL,
          )?.id
        );
      }),
    }));
    partiesWithEmails.sort((a, b) => (a.id < b.id ? -1 : 1));
    return partiesWithEmails;
  }, [client]);

  const [parties, getParties] = usePromiseCreator(fetchParties);
  useAfterAuth(getParties);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();

      const form = e.target as HTMLFormElement;

      try {
        const emailArr = [...new Set(emails.split(/[\s,]+/).filter((e) => !!e))];
        const userMapping = await client.AuthAdminService.resolveEmails(emailArr);
        const userIds: string[] = [];

        for (const email of emailArr) {
          const userId = userMapping[email];

          if (!userId) {
            throw new Error(`No user found for email ${email}`);
          }

          userIds.push(userId);
        }

        await client.PartyAdminService.createParty(userIds);
        form.reset();
        setError(null);
      } catch (e: any) {
        logError(e);
        setError(`Error: ${e.message || e}`);
      } finally {
        getParties();
      }
    },
    [client, getParties, emails],
  );
  const onDelete = useCallback(
    async (partyId: string) => {
      await client.PartyAdminService.deleteParty(partyId);
      getParties();
    },
    [client, getParties],
  );

  return (
    <div className={styles.contentWrapper}>
      <Helmet>
        <title>Party / Admin</title>
      </Helmet>

      <h1 className={styles.title}>Party Admin</h1>

      {parties && parties.length ? (
        <table className="party-list">
          <thead>
            <tr>
              <th>Party ID</th>
              <th>Party Members</th>
            </tr>
          </thead>
          <tbody>
            {parties.map((party) => (
              <tr key={party.id}>
                <td width="30%">{party.id}</td>
                <td>{party.emails.join(', ')}</td>
                <td>
                  <Button
                    size="sm"
                    onClick={() => onDelete(party.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      <form onSubmit={onSubmit}>
        <div className={styles.inputWrapper}>
          {error ? <label className={styles.error}>{error}</label> : null}

          <TextArea
            cols={100}
            label="Enter up to 4 emails separated by commas, spaces or new lines"
            name="emails"
            rows={4}
            theme="blue"
            onChange={(event) => setEmails(event.target.value)}
          />
        </div>

        <div className={styles.buttonWrapper}>
          <Button
            size="lg"
            type="submit"
            variant="cta"
          >
            Create Party
          </Button>
        </div>
      </form>
    </div>
  );
}
