/* eslint-disable max-len */
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { HttpError } from 'src/api/errors/HttpError';

import { ApplicationError } from 'src/types/errors/ApplicationError';
import { IdentityUserSchema } from 'src/types/IdentityUser';
import { IIdentityService } from 'src/types/services/IIdentityService';

export const getAWSCognitoService = (options: { userPoolId: string }): IIdentityService => {
  const { userPoolId } = options;

  const client = new CognitoIdentityProvider();

  return {
    async setUserPassword(payload) {
      try {
        await client.adminSetUserPassword({
          UserPoolId: userPoolId,
          Username: payload.email,
          Password: payload.password,
          Permanent: true
        });
      } catch (err) {
        throw new ApplicationError('Cognito adminSetUserPassword error', err);
      }
    },

    async createUser(payload) {
      const subId = await this.createUserWithoutPassword(payload);

      await this.setUserPassword(payload);

      return subId;
    },

    async createUserWithoutPassword(payload) {
      try {
        const createdCognitoUser = await client.adminCreateUser({
          UserPoolId: userPoolId,
          Username: payload.email,
          UserAttributes: [
            { Name: 'email', Value: payload.email },
            { Name: 'email_verified', Value: 'true' }
          ],
          MessageAction: 'SUPPRESS'
        });

        if (!createdCognitoUser.User || !createdCognitoUser.User.Attributes) {
          throw new HttpError(404, 'Failed to get user details from Cognito after creation.');
        }

        const subAttribute = createdCognitoUser.User.Attributes.find((attr) => attr.Name === 'sub');

        if (!subAttribute || !subAttribute.Value) {
          throw new HttpError(404, "Could not find 'sub' attribute in Cognito response.");
        }

        return subAttribute.Value;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected error';

        throw new HttpError(400, message);
      }
    },

    async getUserByAccessToken(token: string) {
      try {
        const user = await client.getUser({
          AccessToken: token
        });

        const rawUserData = user.UserAttributes?.reduce<Record<string, string | null>>(
          (acc, attribute) => {
            if (attribute.Name) {
              return { ...acc, [attribute.Name]: attribute.Value || null };
            }

            return acc;
          },
          {}
        );
// CODE REVIEW: Використовуючи тут non-null assertion operator "!", ти ломаєш логіку тайпскріпта і отримуєш місце потенційного багу. 
// Ти не можеш бути впевненим що rawUserData не буде undefined, так як user.UserAttributes може бути undefined.
        return IdentityUserSchema.parse({
          subId: rawUserData!.sub, 
          email: rawUserData!.email
        });
      } catch (err) {
        throw new ApplicationError('Cognito error', err);
      }
    },

    async getUserBySubId(subId: string) {
      try {
        const result = await client.listUsers({
          UserPoolId: userPoolId,
          Filter: `sub = "${subId}"`
        });

        const user = result.Users?.[0];

        if (!user) {
          throw new ApplicationError(`User ${subId} not found`);
        }

        const rawUserData = user?.Attributes?.reduce<Record<string, string | null>>(
          (acc, attribute) => {
            if (attribute.Name) {
              return { ...acc, [attribute.Name]: attribute.Value || null };
            }

            return acc;
          },
          {}
        );

        return IdentityUserSchema.parse({
          subId: rawUserData!.sub,
          email: rawUserData!.email
        });
      } catch (err) {
        throw new ApplicationError('Cognito error', err);
      }
    },

    async disableUser(email: string) {
      try {
        await client.adminDisableUser({
          UserPoolId: userPoolId,
          Username: email
        });
      } catch (err) {
        throw new ApplicationError('Cognito error', err);
      }
    },

    async deleteUser(email: string) {
      try {
        await client.adminDeleteUser({
          UserPoolId: userPoolId,
          Username: email
        });
      } catch (err) {
        throw new ApplicationError('Cognito error', err);
      }
    },

    async enableUser(email: string) {
      try {
        await client.adminEnableUser({
          UserPoolId: userPoolId,
          Username: email
        });
      } catch (err) {
        throw new ApplicationError('Cognito error', err);
      }
    }
  };
};
