// Code copied (with some modifications) from the Keystone 6 "with-auth" example
// See.. https://github.com/keystonejs/keystone/tree/master/examples/with-auth

import { list } from '@keystone-6/core';
import { checkbox, password, relationship, text, timestamp, select } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';

export const lists = {
  Task: list({
    fields: {
      label: text({ isRequired: true }),
      priority: select({
        dataType: 'enum',
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ],
      }),
      isComplete: checkbox(),
      assignedTo: relationship({ ref: 'Person.tasks', many: false }),
      finishBy: timestamp(),
    },
  }),
  Person: list({
    fields: {
      name: text({ isRequired: true }),
      // Added an email and password pair to be used with authentication
      // The email address is going to be used as the identity field, so it's
      // important that we set both isRequired and isUnique
      email: text({ isRequired: true, isUnique: true, isIndexed: 'unique' }),
      // The password field stores a hash of the supplied password, and
      // we want to ensure that all people have a password set, so we use
      // the isRequired flag.
      password: password({ isRequired: true }),
      tasks: relationship({ ref: 'Task.assignedTo', many: true }),
      posts: relationship({ ref: 'Post.author', many: true }),
    },
  }),
  Post: list({
    fields: {
      title: text(),
      // Having the status here will make it easy for us to choose whether to display
      // posts on a live site.
      status: select({
        options: [
          { label: 'Published', value: 'published' },
          { label: 'Draft', value: 'draft' },
        ],
        // We want to make sure new posts start off as a draft when they are created
        defaultValue: 'draft',
        // fields also have the ability to configure their appearance in the Admin UI
        ui: {
          displayMode: 'segmented-control',
        },
      }),
      // The document field can be used for making highly editable content. Check out our
      // guide on the document field https://keystonejs.com/docs/guides/document-fields#how-to-use-document-fields
      // for more information
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),
      publishDate: timestamp(),
      // Here is the link from post => author.
      // We've configured its UI display quite a lot to make the experience of editing posts better.
      author: relationship({
        ref: 'Person.posts',
        ui: {
          displayMode: 'cards',
          cardFields: ['name', 'email'],
          inlineEdit: { fields: ['name', 'email'] },
          linkToItem: true,
        },
      }),
    },
  }),
};
