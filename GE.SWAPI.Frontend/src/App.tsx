import { useState, useEffect } from "react";
import "./layout.css";
import {
  ActionIcon,
  Box,
  Button,
  Grid,
  GridCol,
  Group,
  MantineProvider,
  Stack,
  Text,
} from "@mantine/core";
import { closeModal, openModal } from "@mantine/modals";
import { theme } from "./theme";
import './App.css'; 
import { DataTable } from "mantine-datatable";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";

interface Starship {
  id: number;
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
}

interface PagedResult<T> {
  data: T[];
  totalRecords: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function App() {
  const [starshipData, setStarshipData] = useState<Starship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchStarshipData = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL; // Provided by Aspire
      const response = await fetch(
        `${apiUrl}/starship/paged?page=${page}&pageSize=${recordsPerPage}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: PagedResult<Starship> = await response.json();
      setStarshipData(result.data);
      setTotalRecords(result.totalRecords);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch starship data",
      );
      console.error("Error fetching starship data:", err);
    } finally {
      setLoading(false);
    }
  };

  const showModal = ({
    starship,
    action,
  }: {
    starship: Starship;
    action: "view" | "edit" | "delete";
  }) => {
    openModal({
      modalId: action,
      title:
        action === "view"
          ? "Showing starship information"
          : action === "edit"
            ? "Editing starship information"
            : "Deleting starship",
      children: (
        <Stack>
          <Text>
            {action === "view"
              ? "Here’s where you could show more information..."
              : action === "edit"
                ? "Here’s where you could put an edit form..."
                : "Here’s where you could ask for confirmation before deleting..."}
          </Text>
          <Grid gutter="xs">
            <GridCol span={2}>ID</GridCol>
            <GridCol span={10}>{starship.id}</GridCol>
            <GridCol span={2}>Name</GridCol>
            <GridCol span={10}>{starship.name}</GridCol>
            <GridCol span={2}>Model</GridCol>
            <GridCol span={10}>{starship.model}</GridCol>
          </Grid>
          <Button onClick={() => closeModal(action)}>Close</Button>
        </Stack>
      ),
    });
  };

  useEffect(() => {
    fetchStarshipData();
  }, [page, recordsPerPage]);

  return (
    <MantineProvider theme={theme}>
      <div className="app-container">
        <header className="app-header">
          <h3 className="app-title">SW API Starships</h3>
        </header>

        <main className="main-content">
          <DataTable
            withRowBorders={true}
            withColumnBorders={true}
            highlightOnHover={true}
            fetching={loading}
            pinFirstColumn={true}
            height={500}
            page={page}
            onPageChange={setPage}
            totalRecords={totalRecords}
            recordsPerPage={recordsPerPage}
            recordsPerPageOptions={[10, 20, 50, 100]}
            onRecordsPerPageChange={setRecordsPerPage}
            columns={[
              {
                accessor: "actions",
                title: (
                  <Group gap={10} pl={3} wrap="nowrap" c="dimmed">
                    <IconEye size={16} />
                    <IconEdit size={16} />
                    <IconTrash size={16} />
                  </Group>
                ),
                render: (starship) => (
                  <Group gap={4} wrap="nowrap">
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="green"
                      onClick={() => showModal({ starship, action: "view" })}
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="blue"
                      onClick={() => showModal({ starship, action: "edit" })}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="red"
                      onClick={() => showModal({ starship, action: "delete" })}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                ),

                footer: (
                  <Group gap="xs">
                    <Box mb={-4}>
                      <div>
                        {totalRecords} starship
                        {totalRecords !== 1 ? "s" : ""}
                      </div>
                    </Box>
                  </Group>
                ),
              },
              { accessor: "name" },
              { accessor: "model" },
              { accessor: "manufacturer" },
              { accessor: "cost_in_credits" },
              { accessor: "length" },
              { accessor: "max_atmosphering_speed" },
              { accessor: "crew" },
              { accessor: "passengers" },
              { accessor: "cargo_capacity" },
              { accessor: "consumables" },
              { accessor: "hyperdrive_rating" },
              { accessor: "MGLT" },
              { accessor: "starship_class" },
            ]}
            records={starshipData}
          />
        </main>
      </div>
    </MantineProvider>
  );
}

export default App;
