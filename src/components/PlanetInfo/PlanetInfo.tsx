import React from "react";
import { useQuery } from "react-query";
import { getPlanet } from "../../services/api";
import {
  Alert,
  AlertTitle,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Popover,
  Backdrop,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface PlanetInfoProps {
  planetUrl: string;
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLTableCellElement | null;
}

const PlanetInfo: React.FC<PlanetInfoProps> = ({
  planetUrl,
  open,
  onClose,
  anchorEl,
}) => {
  const {
    data: planet,
    isLoading,
    isError,
  } = useQuery(["planet", planetUrl], () => getPlanet(planetUrl));

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
      <Backdrop
        open={open}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          opacity: 0.5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Paper style={{ padding: "16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5">Planet Information</Typography>
              <IconButton onClick={onClose} size="large">
                <CloseIcon />
              </IconButton>
            </div>
            {isError ? (
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                Error loading planets. Please try again.
              </Alert>
            ) : (
              <List>
                <ListItem>
                  <ListItemText primary={`Name: ${planet?.name}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`Diameter: ${planet?.diameter}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`Climate: ${planet?.climate}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`Population: ${planet?.population}`} />
                </ListItem>
              </List>
            )}
          </Paper>
        )}
      </Backdrop>
    </Popover>
  );
};

export default PlanetInfo;
