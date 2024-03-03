import React, { useState, useEffect } from 'react';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import {
  Button,
  Divider,
  Flex,
  Image,
  SelectField,
  Text,
  View,
  withAuthenticator,
} from '@aws-amplify/ui-react';
import { listEntries } from './graphql/queries';
import {
  createEntry as createEntryMutation,
  deleteEntry as deleteEntryMutation,
  updateEntry as updateEntryMutation,
} from './graphql/mutations';

const students = [
  {
    studentName: 'Jane Doe',
    studentId: 'janedoe1',
  },
  {
    studentName: 'John Doe',
    studentId: 'johndoe1',
  },
];

const App = ({ signOut }) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetchEntries();
  }, []);

  const client = generateClient();

  async function fetchEntries() {
    const apiData = await client.graphql({ query: listEntries });
    const entriesFromAPI = apiData.data.listEntries.items.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    console.log(entriesFromAPI);
    setEntries(entriesFromAPI);
  }

  async function createEntry(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const { username } = await getCurrentUser();
    const student = students.find(
      (student) => student.studentName === form.get('student')
    );
    const data = {
      studentName: student.studentName,
      studentId: student.studentId,
      destination: form.get('destination'),
      teacher: username,
      teacherId: username,
    };
    await client.graphql({
      query: createEntryMutation,
      variables: { input: data },
    });
    fetchEntries();
    event.target.reset();
  }

  async function updateEntry({ id }) {
    await client.graphql({
      query: updateEntryMutation,
      variables: { input: { id } },
    });
    fetchEntries();
  }

  async function deleteEntry({ id }) {
    const newEntries = entries.filter((note) => note.id !== id);
    setEntries(newEntries);
    await client.graphql({
      query: deleteEntryMutation,
      variables: { input: { id } },
    });
  }

  return (
    <View className="App">
      {/* <Heading level={1}>Hall-Waze</Heading> */}
      <View textAlign="center" backgroundColor="#73c0d3">
        <Image alt="Hall-Waze logo" src="/hall-waze.png" />
      </View>
      <View as="form" margin="2rem 0" onSubmit={createEntry}>
        <Flex direction="row" justifyContent="center">
          <SelectField label="Student" name="student">
            <option value="Jane Doe">Jane Doe</option>
            <option value="John Doe">John Doe</option>
            <option value="Mavis Lynch">Mavis Lynch</option>
            <option value="Zane Richardson">Zane Richardson</option>
            <option value="Allison Guevara">Allison Guevara</option>
            <option value="Tommy Wilcox">Tommy Wilcox</option>
            <option value="Ashlyn Doyle">Ashlyn Doyle</option>
          </SelectField>
          <SelectField label="Destination" name="destination">
            <option value="Bathroom">Bathroom</option>
            <option value="Nurse">Nurse</option>
            <option value="Main Office">Main Office</option>
            <option value="Tucker">Mr. Tucker</option>
            <option value="Powers">Ms. Powers</option>
            <option value="Pennington">Ms. Pennington</option>
            <option value="Hampton">Mr. Hampton</option>
          </SelectField>
        </Flex>
        <Button
          type="submit"
          variation="primary"
          width="25vw"
          marginTop="2rem"
        >
          Submit
        </Button>
      </View>
      {/* <Heading level={2}>Current Entries</Heading> */}
      <Divider />
      <View margin="1rem">
        {entries.map((entry) => (
          <Flex
            key={entry.id || entry.code}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <View
              direction="column"
              justifyContent="center"
              alignItems="center"
              border="1px solid var(--amplify-colors-black)"
              margin="1rem"
              padding="1rem"
            >
              <Flex
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <Flex direction="row">
                  <Text as="strong" fontWeight={700}>
                    Student: {entry.studentName}
                  </Text>
                  <Text as="span">
                    Destination: {entry.destination}
                  </Text>
                  <Text>
                    Time:{' '}
                    {new Date(entry.createdAt).toLocaleTimeString(
                      'en',
                      {
                        timeStyle: 'short',
                        hour12: true,
                        timeZone: 'EST',
                      }
                    )}
                  </Text>
                  {entry.createdAt === entry.updatedAt ? null : (
                    <Text>
                      Returned:{' '}
                      {new Date(entry.updatedAt).toLocaleTimeString(
                        'en',
                        {
                          timeStyle: 'short',
                          hour12: true,
                          timeZone: 'EST',
                        }
                      )}
                    </Text>
                  )}
                </Flex>
                {entry.createdAt === entry.updatedAt ? (
                  <Button onClick={() => updateEntry(entry)}>
                    Return
                  </Button>
                ) : null}
              </Flex>
            </View>
          </Flex>
        ))}
      </View>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
};

export default withAuthenticator(App);
