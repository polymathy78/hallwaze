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

import students from './students.json';
import { listEntries, entriesByStudentId } from './graphql/queries';
import {
  createEntry as createEntryMutation,
  // deleteEntry as deleteEntryMutation,
  updateEntry as updateEntryMutation,
} from './graphql/mutations';

// const students = [
//   {
//     studentName: 'Jane Doe',
//     studentId: 'janedoe1',
//   },
//   {
//     studentName: 'John Doe',
//     studentId: 'johndoe1',
//   },
//   {
//     studentName: 'Mavis Lynch',
//     studentId: 'ml1',
//   },
//   {
//     studentName: 'Allison Guevara',
//     studentId: 'ag1',
//   },
//   {
//     studentName: 'Zane Richardson',
//     studentId: 'zr1',
//   },
//   {
//     studentName: 'Tommy Wilcox',
//     studentId: 'tw1',
//   },
//   {
//     studentName: 'Ashlyn Doyle',
//     studentId: 'ad1',
//   },
// ];

const App = ({ signOut }) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetchEntries();
  }, []);

  const client = generateClient();

  async function fetchEntries() {
    const apiData = await client.graphql({ query: listEntries });
    const entriesFromAPI = apiData.data.listEntries.items
      .filter((i) => i.createdAt === i.updatedAt)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    console.log(entriesFromAPI);
    setEntries(entriesFromAPI);
  }

  async function createEntry(event) {
    event.preventDefault();
    //get teacher info
    const { username } = await getCurrentUser();

    //get form data
    const form = new FormData(event.target);

    //find student name from form
    const student = students.find(
      (student) => student.studentName === form.get('student')
    );

    //get data from form
    const data = {
      studentName: student.studentName,
      studentId: student.studentId,
      destination: form.get('destination'),
      teacher: username,
      teacherId: username,
    };

    const studentEntries = await client.graphql({
      query: entriesByStudentId,
      variables: { studentId: student.studentId },
    });
    console.log(studentEntries);

    if (studentEntries.data.entriesByStudentId.items.length === 0) {
      console.log("Add student's first trip to DB...");
      await client.graphql({
        query: createEntryMutation,
        variables: { input: data },
      });
    } else {
      console.log('Studnet has left before');
      console.log(studentEntries);
      const sortedEntries =
        studentEntries.data.entriesByStudentId.items.sort(
          (a, b) => a.updatedAt - b.updatedAt
        );
      let latestEntry = sortedEntries[0];
      let latestEntryTime = new Date(latestEntry.updatedAt);
      let latestEntryTimeStamp = latestEntryTime.getTime();
      let currentTime = Date.now();
      const timePassed =
        currentTime / 1000 - latestEntryTimeStamp / 1000;
      console.log('Time passed...', timePassed);
      if (timePassed < 3600) {
        let beat = new Audio('/sounds/ding.mp3');
        beat.play();
      } else {
        console.log('You may go again!');
        console.log("Add student's trip to DB...");
        await client.graphql({
          query: createEntryMutation,
          variables: { input: data },
        });
      }
    }

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

  return (
    <View className="App">
      <View backgroundColor="#73c0d3">
        <Flex justifyContent="end">
          <Button variation="link" onClick={signOut}>
            Sign Out
          </Button>
        </Flex>
        <View>
          <Image alt="Hall-Waze logo" src="/hall-waze.png" />
        </View>
      </View>
      <View as="form" margin="2rem 0" onSubmit={createEntry}>
        <Flex direction="row" justifyContent="center">
          <SelectField label="Student" name="student">
            {students.map((student) => (
              <option
                key={student.studentId}
                value={student.studentName}
              >
                {student.studentName}
              </option>
            ))}
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
    </View>
  );
};

export default withAuthenticator(App);
