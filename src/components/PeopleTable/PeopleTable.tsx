import React from "react";
import { useQuery } from "react-query";
import { getPeople } from "../../services/api";
import Person from "../../interfaces/Person.interface";
import CircularProgress from "@mui/material/CircularProgress";
import { Alert, AlertTitle, Box, css, styled } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import dayjs from "dayjs";

const PeopleTable: React.FC = () => {
  const { data: people, isLoading, isError } = useQuery("people", getPeople);

  if (isLoading) {
    return (
      <StyledBox>
        <CircularProgress />
      </StyledBox>
    );
  }

  return (
    <div>
      <h2>List of People</h2>
      {isError ? (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Error loading people. Please try again.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Height</TableCell>
                <TableCell>Mass</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Edited</TableCell>
                <TableCell>Planet Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {people.map((person: Person) => (
                <TableRow key={person.name}>
                  <TableCell>{person.name}</TableCell>
                  <TableCell>{person.height}</TableCell>
                  <TableCell>{person.mass}</TableCell>
                  <TableCell>
                    {dayjs(person.created).format("DD.MM.YYYY. HH:mm")}
                  </TableCell>
                  <TableCell>
                    {dayjs(person.edited).format("DD.MM.YYYY. HH:mm")}
                  </TableCell>
                  <TableCell>{person.homeworld}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default PeopleTable;

const StyledBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
