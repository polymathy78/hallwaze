import React, { useState, useEffect } from 'react';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import {
  Button,
  Card,
  Collection,
  Divider,
  Flex,
  Heading,
  Image,
  SelectField,
  Text,
  View,
  withAuthenticator,
} from '@aws-amplify/ui-react';

import students from './data/students.json';
import { listEntries, entriesByStudentId } from './graphql/queries';
import {
  createEntry as createEntryMutation,
  // deleteEntry as deleteEntryMutation,
  updateEntry as updateEntryMutation,
} from './graphql/mutations';

const App = ({ signOut }) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetchEntries();
  }, []);

  const client = generateClient();

  let places = [
    'Bathroom',
    'Nurse',
    'Main office',
    'Gymnasium',
    'Guidance Office',
    'School Psychologist',
    'Educator Classroom',
    'Assistant Principal Office',
    'In School Suspension',
    'Cafeteria',
    'Emergency Resource Teacher',
    'Peer Mediator',
    'IB Coordinator',
    'Security Office',
    'Custodial Staff Office',
    "Principal's Office",
  ];

  async function fetchEntries() {
    const apiData = await client.graphql({ query: listEntries });
    const { username } = await getCurrentUser();
    const entriesFromAPI = apiData.data.listEntries.items
      .filter((i) => i.createdAt === i.updatedAt)
      .filter((t) => t.teacherId === username)
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
              <option value={student.studentName}>
                {student.studentName}
              </option>
            ))}
          </SelectField>
          <SelectField label="Destination" name="destination">
            {places.map((place) => (
              <option key={place} value={place}>
                {place}
              </option>
            ))}
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
      <View margin="1rem"></View>
      <Collection
        items={entries}
        type="list"
        direction="row"
        wrap="wrap"
        justifyContent="center"
      >
        {(item, index) => (
          <Card
            key={index}
            borderRadius="medium"
            maxWidth="20rem"
            variation="outlined"
          >
            <View padding="xs">
              <Heading padding="medium">{item.studentName}</Heading>
              <Divider padding="xs" />
              <Text padding="medium">
                Destination: {item.destination}
              </Text>
              <Text>
                Time:{' '}
                {new Date(item.createdAt).toLocaleTimeString('en', {
                  timeStyle: 'short',
                  hour12: true,
                  // timeZone: 'EST',
                })}
              </Text>
              {item.createdAt === item.updatedAt ? null : (
                <Text>
                  Returned:{' '}
                  {new Date(item.updatedAt).toLocaleTimeString('en', {
                    timeStyle: 'short',
                    hour12: true,
                    timeZone: 'EST',
                  })}
                </Text>
              )}
              {item.createdAt === item.updatedAt ? (
                <Button
                  marginTop="medium"
                  variation="primary"
                  onClick={() => updateEntry(item)}
                >
                  Return
                </Button>
              ) : null}
            </View>
          </Card>
        )}
      </Collection>
    </View>
  );
};

export default withAuthenticator(App);
