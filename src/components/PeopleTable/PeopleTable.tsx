import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import "./PeopleTable.css";
import { getPeople, getPlanet } from "../../services/api";
import Person from "../../interfaces/Person.interface";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Alert,
  AlertTitle,
  Box,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  TableSortLabel,
} from "@mui/material";
import dayjs from "dayjs";
import PlanetInfo from "../PlanetInfo/PlanetInfo";
import Planet from "../../interfaces/Planet.interface";

const PeopleTable: React.FC = () => {
  const { data: people, isLoading, isError } = useQuery("people", getPeople);
  const [planetInfo, setPlanetInfo] = useState<{
    [key: string]: Planet | null;
  }>({});
  const [selectedPlanetEl] = useState<HTMLTableCellElement | null>(null);
  const [selectedPlanetUrl, setSelectedPlanetUrl] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string>("name");

  useEffect(() => {
    const fetchPlanetInfo = async (planetUrl: string) => {
      try {
        const planetData: Planet = await getPlanet(planetUrl);
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

  const filteredPeople = people?.filter((person: Person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSortByColumn = (column: string) => {
    if (sortColumn === column) {
      setSortOrder((prevSortOrder) => {
        return prevSortOrder === "asc" ? "desc" : "asc";
      });
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortFunction = (a: Person, b: Person) => {
    const getPlanetName = (person: Person) =>
      planetInfo[person.homeworld]?.name || "";

    if (sortOrder === "asc") {
      switch (sortColumn) {
        case "name":
          return a.name.localeCompare(b.name);
        case "planet":
          return getPlanetName(a).localeCompare(getPlanetName(b));
        case "height":
        case "mass":
          return parseFloat(a[sortColumn]) - parseFloat(b[sortColumn]);
        case "created":
        case "edited":
          return dayjs(a[sortColumn]).unix() - dayjs(b[sortColumn]).unix();
        default:
          return 0;
      }
    } else {
      switch (sortColumn) {
        case "name":
          return b.name.localeCompare(a.name);
        case "planet":
          return getPlanetName(b).localeCompare(getPlanetName(a));
        case "height":
        case "mass":
          return parseFloat(b[sortColumn]) - parseFloat(a[sortColumn]);
        case "created":
        case "edited":
          return dayjs(b[sortColumn]).unix() - dayjs(a[sortColumn]).unix();
        default:
          return 0;
      }
    }
  };

  const sortedPeople = [...(filteredPeople || [])].sort(sortFunction);

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
    <Box className="container">
      <Typography className="title" variant="h4">
        List of People
      </Typography>
      <Box
        sx={{
          display: "flex",
          marginBottom: "30px",
          marginTop: "30px",
        }}
      >
        <Box>
          <TextField
            label="Search People"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
          />
        </Box>
      </Box>

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
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === "name"}
                    direction={sortOrder}
                    onClick={() => handleSortByColumn("name")}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === "height"}
                    direction={sortOrder}
                    onClick={() => handleSortByColumn("height")}
                  >
                    Height
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === "mass"}
                    direction={sortOrder}
                    onClick={() => handleSortByColumn("mass")}
                  >
                    Mass
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === "created"}
                    direction={sortOrder}
                    onClick={() => handleSortByColumn("created")}
                  >
                    Created
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === "edited"}
                    direction={sortOrder}
                    onClick={() => handleSortByColumn("edited")}
                  >
                    Edited
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === "planet"}
                    direction={sortOrder}
                    onClick={() => handleSortByColumn("planet")}
                  >
                    Planet Name
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedPeople?.map((person: Person) => (
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
                    sx={{ fontWeight: "bold" }}
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
    </Box>
  );
};

export default PeopleTable;

const StyledBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
