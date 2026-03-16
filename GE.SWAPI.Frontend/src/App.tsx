import { useState, useEffect } from "react";
import "./layout.css";
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Group,
  MantineProvider,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { theme } from "./theme";
import "./App.css";
import { DataTable, type DataTableSortStatus } from "mantine-datatable";
import { IconAlertCircle, IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import type { Starship } from "./types/Starship";
import { emptyStarship } from "./types/Starship";
import { fetchStarships, createStarship, updateStarship, deleteStarship } from "./services/starshipApi";
import { StarshipViewModal } from "./components/StarshipViewModal";
import { StarshipFormModal } from "./components/StarshipFormModal";
import { StarshipDeleteModal } from "./components/StarshipDeleteModal";

function App() {
  const [starshipData, setStarshipData] = useState<Starship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "name",
    direction: "asc",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStarship, setSelectedStarship] = useState<Starship | null>(null);
  const [viewOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchStarships({
        page,
        pageSize: recordsPerPage,
        sortColumn: sortStatus?.columnAccessor,
        sortDirection: sortStatus?.direction,
        searchTerm,
      });
      setStarshipData(result.data);
      setTotalRecords(result.totalRecords);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch starship data");
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
    setSelectedStarship(starship);
    if (action === "view") {
      openView();
    } else if (action === "edit") {
      setFormMode("edit");
      openForm();
    } else if (action === "delete") {
      openDelete();
    }
  };

  const handleCreateNew = () => {
    setSelectedStarship({ ...emptyStarship });
    setFormMode("create");
    openForm();
  };

  const handleFormSubmit = async (data: Starship) => {
    if (formMode === "edit") {
      await updateStarship(data);
    } else {
      await createStarship(data);
    }
    await fetchData();
    closeForm();
  };

  const handleDeleteConfirm = async (starship: Starship) => {
    await deleteStarship(starship.id);
    await fetchData();
    closeDelete();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, recordsPerPage, sortStatus, searchTerm]);

  return (
    <MantineProvider theme={theme}>
      <div className="app-container">
        <header className="app-header">
          <h3 className="app-title">SW API Starships</h3>
          <Group mb="md" className="app-search">
            <TextInput
              placeholder="Search starships..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.currentTarget.value);
                setPage(1);
              }}
              style={{ flex: 1, maxWidth: 400 }}
              leftSection={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              }
            />
            {searchTerm && (
              <Button
                variant="subtle"
                color="gray"
                onClick={() => {
                  setSearchTerm("");
                  setPage(1);
                }}
              >
                Clear
              </Button>
            )}
            <Button variant="filled" color="blue" onClick={handleCreateNew}>
              Add New Starship
            </Button>
          </Group>
        </header>

        <main className="main-content">
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error loading starships"
              color="red"
              withCloseButton
              onClose={() => setError(null)}
              mb="md"
            >
              {error}
            </Alert>
          )}

          <StarshipViewModal
            opened={viewOpened}
            onClose={closeView}
            starship={selectedStarship}
          />

          <StarshipFormModal
            opened={formOpened}
            onClose={closeForm}
            mode={formMode}
            initialData={selectedStarship}
            onSubmit={handleFormSubmit}
          />

          <StarshipDeleteModal
            opened={deleteOpened}
            onClose={closeDelete}
            starship={selectedStarship}
            onConfirm={handleDeleteConfirm}
          />

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
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
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
                render: (record) => {
                  const starship = record as unknown as Starship;
                  return (
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
                  );
                },
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
              { accessor: "name", sortable: true },
              { accessor: "model", sortable: true },
              { accessor: "manufacturer", sortable: true },
              { accessor: "cost_in_credits", sortable: true },
              { accessor: "length", sortable: true },
              { accessor: "max_atmosphering_speed", sortable: true },
              { accessor: "crew", sortable: true },
              { accessor: "passengers", sortable: true },
              { accessor: "cargo_capacity", sortable: true },
              { accessor: "consumables", sortable: true },
              { accessor: "hyperdrive_rating", sortable: true },
              { accessor: "MGLT", sortable: true },
              { accessor: "starship_class", sortable: true },
            ]}
            records={starshipData as unknown as Record<string, unknown>[]}
          />
        </main>
      </div>
    </MantineProvider>
  );
}

export default App;
