import { BiBone, BiCool, BiGhost, BiRadio, BiSprayCan } from 'react-icons/bi';

import { AuthPlatformRole } from '../../../gen';
import {
  moduleBreadCrumbs,
  modulePathPermissions,
  moduleWithPaths,
  routes,
  topNavigationItems,
} from '../module-routing';

import { Module } from '@common/module';

jest.mock('../modules', (): { modules: Module[] } => ({
  modules: [
    {
      id: 'first-module',
      title: 'First Module',
      pages: [
        {
          id: 'lorem-ipsum',
          title: 'Lorem Ipsum',
          component: <div id="lorem-ipsum" />,
          icon: BiBone,
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porta nunc sed leo rhoncus efficitur.',
          subPages: [
            {
              id: 'maecenas',
              title: 'Maecenas',
              component: <div id="maecenas" />,
              description: 'Maecenas porttitor mauris et nibh egestas vestibulum',
              icon: BiCool,
              permissions: [AuthPlatformRole.PlatformRoleModerator],
            },
            {
              id: 'etiam-mollis',
              title: 'Etiam mollis',
              component: <div id="etiam-mollis" />,
              description:
                'Etiam mollis vel dui a vehicula. Maecenas tristique, diam vel dapibus feugiat, dui mi ultrices est, lacinia faucibus quam lacus sed turpis. ',
              icon: BiGhost,
            },
          ],
        },
        {
          id: ':preasent',
          title: 'Preasent',
          component: <div id="preasent" />,
          description: 'Praesent malesuada libero in dui pulvinar ullamcorper',
          icon: BiSprayCan,
          permissions: [
            AuthPlatformRole.PlatformRoleModerator,
            AuthPlatformRole.PlatformRolePxAgent,
          ],
        },
      ],
    },
    {
      id: 'second-module',
      title: 'Second module',
      pages: [
        {
          id: 'index',
          title: 'Nulla',
          icon: BiRadio,
          description:
            'Nulla in justo diam. Sed lectus dui, auctor finibus sollicitudin eu, hendrerit non turpis.',
          component: <div id="nulla" />,
        },
      ],
    },
  ],
}));

describe('Module', () => {
  it('adds correct paths to modules', () => {
    expect(moduleWithPaths).toEqual([
      {
        id: 'first-module',
        pages: [
          {
            component: <div id="lorem-ipsum" />,
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porta nunc sed leo rhoncus efficitur.',
            icon: BiBone,
            id: 'lorem-ipsum',
            subPages: [
              {
                component: <div id="maecenas" />,
                description: 'Maecenas porttitor mauris et nibh egestas vestibulum',
                icon: BiCool,
                id: 'maecenas',
                path: 'first-module/lorem-ipsum/maecenas',
                title: 'Maecenas',
                permissions: [AuthPlatformRole.PlatformRoleModerator],
              },
              {
                component: <div id="etiam-mollis" />,
                description:
                  'Etiam mollis vel dui a vehicula. Maecenas tristique, diam vel dapibus feugiat, dui mi ultrices est, lacinia faucibus quam lacus sed turpis. ',
                icon: BiGhost,
                id: 'etiam-mollis',
                path: 'first-module/lorem-ipsum/etiam-mollis',
                title: 'Etiam mollis',
              },
            ],
            path: 'first-module/lorem-ipsum',
            title: 'Lorem Ipsum',
          },
          {
            component: <div id="preasent" />,
            description: 'Praesent malesuada libero in dui pulvinar ullamcorper',
            icon: BiSprayCan,
            id: ':preasent',
            pages: undefined,
            path: 'first-module/:preasent',
            title: 'Preasent',
            permissions: [
              AuthPlatformRole.PlatformRoleModerator,
              AuthPlatformRole.PlatformRolePxAgent,
            ],
          },
        ],
        path: 'first-module',
        title: 'First Module',
      },
      {
        id: 'second-module',
        pages: [
          {
            description:
              'Nulla in justo diam. Sed lectus dui, auctor finibus sollicitudin eu, hendrerit non turpis.',
            icon: BiRadio,
            id: 'index',
            pages: undefined,
            path: 'second-module',
            title: 'Nulla',
            component: <div id="nulla" />,
          },
        ],
        path: 'second-module',
        title: 'Second module',
      },
    ]);
  });

  it('flats all pages to one  of pages', () => {
    expect(routes).toEqual([
      {
        component: <div id="lorem-ipsum" />,
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porta nunc sed leo rhoncus efficitur.',
        icon: BiBone,
        id: 'lorem-ipsum',
        subPages: [
          {
            component: <div id="maecenas" />,
            description: 'Maecenas porttitor mauris et nibh egestas vestibulum',
            icon: BiCool,
            id: 'maecenas',
            path: 'first-module/lorem-ipsum/maecenas',
            title: 'Maecenas',
            permissions: [AuthPlatformRole.PlatformRoleModerator],
          },
          {
            component: <div id="etiam-mollis" />,
            description:
              'Etiam mollis vel dui a vehicula. Maecenas tristique, diam vel dapibus feugiat, dui mi ultrices est, lacinia faucibus quam lacus sed turpis. ',
            icon: BiGhost,
            id: 'etiam-mollis',
            path: 'first-module/lorem-ipsum/etiam-mollis',
            title: 'Etiam mollis',
          },
        ],
        path: 'first-module/lorem-ipsum',
        title: 'Lorem Ipsum',
      },
      {
        component: <div id="maecenas" />,
        description: 'Maecenas porttitor mauris et nibh egestas vestibulum',
        icon: BiCool,
        id: 'maecenas',
        path: 'first-module/lorem-ipsum/maecenas',
        title: 'Maecenas',
        permissions: [AuthPlatformRole.PlatformRoleModerator],
      },
      {
        component: <div id="etiam-mollis" />,
        description:
          'Etiam mollis vel dui a vehicula. Maecenas tristique, diam vel dapibus feugiat, dui mi ultrices est, lacinia faucibus quam lacus sed turpis. ',
        icon: BiGhost,
        id: 'etiam-mollis',
        path: 'first-module/lorem-ipsum/etiam-mollis',
        title: 'Etiam mollis',
      },
      {
        component: <div id="preasent" />,
        description: 'Praesent malesuada libero in dui pulvinar ullamcorper',
        icon: BiSprayCan,
        id: ':preasent',
        path: 'first-module/:preasent',
        title: 'Preasent',
        permissions: [
          AuthPlatformRole.PlatformRoleModerator,
          AuthPlatformRole.PlatformRolePxAgent,
        ],
      },
      {
        description:
          'Nulla in justo diam. Sed lectus dui, auctor finibus sollicitudin eu, hendrerit non turpis.',
        icon: BiRadio,
        id: 'index',
        path: 'second-module',
        title: 'Nulla',
        component: <div id="nulla" />,
      },
    ]);
  });

  it('removes index pages from page array', () => {
    expect(topNavigationItems).toEqual([
      {
        id: 'first-module',
        pages: [
          {
            component: <div id="lorem-ipsum" />,
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porta nunc sed leo rhoncus efficitur.',
            icon: BiBone,
            id: 'lorem-ipsum',
            subPages: [
              {
                component: <div id="maecenas" />,
                description: 'Maecenas porttitor mauris et nibh egestas vestibulum',
                icon: BiCool,
                id: 'maecenas',
                path: 'first-module/lorem-ipsum/maecenas',
                title: 'Maecenas',
                permissions: [AuthPlatformRole.PlatformRoleModerator],
              },
              {
                component: <div id="etiam-mollis" />,
                description:
                  'Etiam mollis vel dui a vehicula. Maecenas tristique, diam vel dapibus feugiat, dui mi ultrices est, lacinia faucibus quam lacus sed turpis. ',
                icon: BiGhost,
                id: 'etiam-mollis',
                path: 'first-module/lorem-ipsum/etiam-mollis',
                title: 'Etiam mollis',
              },
            ],
            path: 'first-module/lorem-ipsum',
            title: 'Lorem Ipsum',
          },
        ],
        path: 'first-module',
        title: 'First Module',
      },
      {
        id: 'second-module',
        pages: [],
        path: 'second-module',
        title: 'Second module',
      },
    ]);
  });

  it('lists all module breadcrumbs', () => {
    expect(moduleBreadCrumbs).toEqual([
      {
        breadcrumbs: [
          {
            page: {
              component: <div id="lorem-ipsum" />,
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porta nunc sed leo rhoncus efficitur.',
              icon: BiBone,
              id: 'lorem-ipsum',
              path: 'first-module/lorem-ipsum',
              subPages: [
                {
                  component: <div id="maecenas" />,
                  description: 'Maecenas porttitor mauris et nibh egestas vestibulum',
                  icon: BiCool,
                  id: 'maecenas',
                  path: 'first-module/lorem-ipsum/maecenas',
                  subSubPages: undefined,
                  title: 'Maecenas',
                  permissions: [AuthPlatformRole.PlatformRoleModerator],
                },
                {
                  component: <div id="etiam-mollis" />,
                  description:
                    'Etiam mollis vel dui a vehicula. Maecenas tristique, diam vel dapibus feugiat, dui mi ultrices est, lacinia faucibus quam lacus sed turpis. ',
                  icon: BiGhost,
                  id: 'etiam-mollis',
                  path: 'first-module/lorem-ipsum/etiam-mollis',
                  subSubPages: undefined,
                  title: 'Etiam mollis',
                },
              ],
              title: 'Lorem Ipsum',
            },
            subPage: {
              component: <div id="maecenas" />,
              description: 'Maecenas porttitor mauris et nibh egestas vestibulum',
              icon: BiCool,
              id: 'maecenas',
              path: 'first-module/lorem-ipsum/maecenas',
              subSubPages: undefined,
              title: 'Maecenas',
              permissions: [AuthPlatformRole.PlatformRoleModerator],
            },
          },
          {
            page: {
              component: <div id="lorem-ipsum" />,
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porta nunc sed leo rhoncus efficitur.',
              icon: BiBone,
              id: 'lorem-ipsum',
              path: 'first-module/lorem-ipsum',
              subPages: [
                {
                  component: <div id="maecenas" />,
                  description: 'Maecenas porttitor mauris et nibh egestas vestibulum',
                  icon: BiCool,
                  id: 'maecenas',
                  path: 'first-module/lorem-ipsum/maecenas',
                  subSubPages: undefined,
                  title: 'Maecenas',
                  permissions: [AuthPlatformRole.PlatformRoleModerator],
                },
                {
                  component: <div id="etiam-mollis" />,
                  description:
                    'Etiam mollis vel dui a vehicula. Maecenas tristique, diam vel dapibus feugiat, dui mi ultrices est, lacinia faucibus quam lacus sed turpis. ',
                  icon: BiGhost,
                  id: 'etiam-mollis',
                  path: 'first-module/lorem-ipsum/etiam-mollis',
                  subSubPages: undefined,
                  title: 'Etiam mollis',
                },
              ],
              title: 'Lorem Ipsum',
            },
            subPage: {
              component: <div id="etiam-mollis" />,
              description:
                'Etiam mollis vel dui a vehicula. Maecenas tristique, diam vel dapibus feugiat, dui mi ultrices est, lacinia faucibus quam lacus sed turpis. ',
              icon: BiGhost,
              id: 'etiam-mollis',
              path: 'first-module/lorem-ipsum/etiam-mollis',
              subSubPages: undefined,
              title: 'Etiam mollis',
            },
          },
          {
            page: {
              component: <div id="preasent" />,
              description: 'Praesent malesuada libero in dui pulvinar ullamcorper',
              icon: BiSprayCan,
              id: ':preasent',
              path: 'first-module/:preasent',
              subPages: undefined,
              title: 'Preasent',
              permissions: [
                AuthPlatformRole.PlatformRoleModerator,
                AuthPlatformRole.PlatformRolePxAgent,
              ],
            },
          },
        ],
        id: 'first-module',
        pages: [
          {
            component: <div id="lorem-ipsum" />,
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porta nunc sed leo rhoncus efficitur.',
            icon: BiBone,
            id: 'lorem-ipsum',
            path: 'first-module/lorem-ipsum',
            subPages: [
              {
                component: <div id="maecenas" />,
                description: 'Maecenas porttitor mauris et nibh egestas vestibulum',
                icon: BiCool,
                id: 'maecenas',
                path: 'first-module/lorem-ipsum/maecenas',
                subSubPages: undefined,
                title: 'Maecenas',
                permissions: [AuthPlatformRole.PlatformRoleModerator],
              },
              {
                component: <div id="etiam-mollis" />,
                description:
                  'Etiam mollis vel dui a vehicula. Maecenas tristique, diam vel dapibus feugiat, dui mi ultrices est, lacinia faucibus quam lacus sed turpis. ',
                icon: BiGhost,
                id: 'etiam-mollis',
                path: 'first-module/lorem-ipsum/etiam-mollis',
                subSubPages: undefined,
                title: 'Etiam mollis',
              },
            ],
            title: 'Lorem Ipsum',
          },
          {
            component: <div id="preasent" />,
            description: 'Praesent malesuada libero in dui pulvinar ullamcorper',
            icon: BiSprayCan,
            id: ':preasent',
            path: 'first-module/:preasent',
            subPages: undefined,
            title: 'Preasent',
            permissions: [
              AuthPlatformRole.PlatformRoleModerator,
              AuthPlatformRole.PlatformRolePxAgent,
            ],
          },
        ],
        path: 'first-module',
        title: 'First Module',
      },
      {
        breadcrumbs: [
          {
            page: {
              component: <div id="nulla" />,
              description:
                'Nulla in justo diam. Sed lectus dui, auctor finibus sollicitudin eu, hendrerit non turpis.',
              icon: BiRadio,
              id: 'index',
              path: 'second-module',
              subPages: undefined,
              title: 'Nulla',
            },
          },
        ],
        id: 'second-module',
        pages: [
          {
            component: <div id="nulla" />,
            description:
              'Nulla in justo diam. Sed lectus dui, auctor finibus sollicitudin eu, hendrerit non turpis.',
            icon: BiRadio,
            id: 'index',
            path: 'second-module',
            subPages: undefined,
            title: 'Nulla',
          },
        ],
        path: 'second-module',
        title: 'Second module',
      },
    ]);
  });

  it('maps all paths with permissions', () => {
    expect(modulePathPermissions).toEqual({
      'first-module': [],
      'first-module/:preasent': [
        AuthPlatformRole.PlatformRoleModerator,
        AuthPlatformRole.PlatformRolePxAgent,
      ],
      'first-module/lorem-ipsum': [],
      'first-module/lorem-ipsum/etiam-mollis': [],
      'first-module/lorem-ipsum/maecenas': [AuthPlatformRole.PlatformRoleModerator],
      'second-module': [],
    });
  });
});
