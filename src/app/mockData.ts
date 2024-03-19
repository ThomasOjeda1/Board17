import { Issue } from './issues-mock.service';

export const mockIssues: Issue[] = [
  {
    uniqueId: '82ef7159-6beb-4f10-a105-af82a807d1fc',
    title: 'America',
    description: 'Continent',
    column: 'column1',
    priority: 0,
  },
  {
    uniqueId: '80fbcf04-0b02-4167-9d90-674e48aeae73',
    title: 'Panama',
    description: 'Country',
    column: 'column1',
    priority: 1,
  },
  {
    uniqueId: '546a49bf-d7ed-4780-ae50-1a3ae7d47da0',
    title: 'Madrid',
    description: 'City',
    column: 'column1',
    priority: 2,
  },
  {
    uniqueId: 'd0fb7738-4dac-45a9-b4f1-78eeabbd6917',
    title: 'Uruguay',
    description: 'Country',
    column: 'column1',
    priority: 3,
  },
  {
    uniqueId: '8e4984f5-0b55-4f02-a7d0-f379586b2088',
    title: 'Europe',
    description: 'Continent',
    column: 'column1',
    priority: 4,
  },
  {
    uniqueId: '5886fab2-9206-4807-9a70-006571bf19ae',
    title: 'Milky Way',
    description: 'Galaxy',
    column: 'column1',
    priority: 5,
  },
  {
    uniqueId: '57984318-6291-4edd-ba73-ac9874f57718',
    title: 'London',
    description: 'City',
    column: 'column2',
    priority: 0,
  },
  {
    uniqueId: '650989ca-e749-404f-b8b5-22c9850c28f2',
    title: 'Sun',
    description: 'Star',
    column: 'column2',
    priority: 1,
  },
  {
    uniqueId: '888cc1cd-eb7b-41c6-8055-d219e2fb22d9',
    title: 'Everest',
    description: 'Mountain',
    column: 'column3',
    priority: 0,
  },
  {
    uniqueId: 'cb104d51-8f11-4683-bfa2-70e8148bd699',
    title: 'Nile',
    description: 'River',
    column: 'column3',
    priority: 1,
  },
  {
    uniqueId: 'c41ff44d-44af-4b5c-bd44-8e65b604ea2b',
    title: 'Sahara',
    description: 'Desert',
    column: 'column3',
    priority: 2,
  },
];

export const mockColumns = ['column1', 'column2', 'column3'];
