import React, { useEffect, useState } from "react";
import "./PeopleTable.css";
import { useQuery } from "react-query";
import { getPeople, getPlanet } from "../../services/api";
import Person from "../../interfaces/Person.interface";
import CircularProgress from "@mui/material/CircularProgress";
import { Alert, AlertTitle, Box, styled } from "@mui/material";
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
import PlanetInfo from "../PlanetInfo/PlanetInfo";

const PeopleTable: React.FC = () => {
  const { data: people, isLoading, isError } = useQuery("people", getPeople);
  const [selectedPlanetUrl, setSelectedPlanetUrl] = useState<string | null>(
    null
  );
  const [planetInfo, setPlanetInfo] = useState<{ [key: string]: any }>({});
  const [selectedPlanetEl, setSelectedPlanetEl] =
    useState<HTMLTableCellElement | null>(null);

  useEffect(() => {
    const fetchPlanetInfo = async (planetUrl: string) => {
      try {
        const planetData = await getPlanet(planetUrl);
        setPlanetInfo((prevInfo) => ({
          ...prevInfo,
          [planetUrl]: planetData,
        }));
      } catch (error) {
        console.error("Error fetching planet info:", error);
        setPlanetInfo((prevInfo) => ({
          ...prevInfo,
          [planetUrl]: null,
        }));
      }
    };

    if (people) {
      people.forEach((person: Person) => {
        fetchPlanetInfo(person.homeworld);
      });
    }
  }, [people]);

  const handlePlanetClick = (planetUrl: string) => {
    setSelectedPlanetUrl(planetUrl);
  };

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
                  <TableCell
                    className="planet-name-style"
                    onClick={() => handlePlanetClick(person.homeworld)}
                  >
                    {planetInfo[person.homeworld]?.name || <CircularProgress />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {selectedPlanetUrl && (
            <PlanetInfo
              planetUrl={selectedPlanetUrl}
              open={Boolean(selectedPlanetUrl)}
              anchorEl={selectedPlanetEl}
              onClose={() => setSelectedPlanetUrl(null)}
            />
          )}
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
