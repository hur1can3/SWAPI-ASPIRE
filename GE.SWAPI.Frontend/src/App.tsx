import { useState, useEffect } from "react";
import "./layout.css";
import {
  ActionIcon,
  Box,
  Button,
  Grid,
  GridCol,
  Group,
  Modal,
  MantineProvider,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { theme } from "./theme";
import "./App.css";
import { DataTable, type DataTableSortStatus } from "mantine-datatable";
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
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "name",
    direction: "asc",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStarship, setSelectedStarship] = useState<Starship | null>(null);
  const [modalAction, setModalAction] = useState<"view" | "edit" | "delete" | null>(null);
  const [viewOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);

  const [formData, setFormData] = useState<Starship | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchStarshipData = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL; // Provided by Aspire
      let url = `${apiUrl}/starship/paged?page=${page}&pageSize=${recordsPerPage}`;

      if (sortStatus) {
        url += `&sortColumn=${sortStatus.columnAccessor}&sortDirection=${sortStatus.direction}`;
      }

      if (searchTerm) {
        url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(url);

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
    setSelectedStarship(starship);
    setModalAction(action);
    setFormData({ ...starship });

    if (action === "view") {
      openView();
    } else if (action === "edit") {
      openEdit();
    } else if (action === "delete") {
      openDelete();
    }
  };

  const handleFormChange = (field: keyof Starship, value: string | number) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleEditSubmit = async () => {
    if (!formData) return;

    setSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/starship/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the data
      await fetchStarshipData();
      closeEdit();
    } catch (err) {
      console.error("Error updating starship:", err);
      alert(err instanceof Error ? err.message : "Failed to update starship");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStarship) return;

    setSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/starship/${selectedStarship.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the data
      await fetchStarshipData();
      closeDelete();
    } catch (err) {
      console.error("Error deleting starship:", err);
      alert(err instanceof Error ? err.message : "Failed to delete starship");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateNew = () => {
    setFormData({
      id: 0,
      name: "",
      model: "",
      manufacturer: "",
      cost_in_credits: "",
      length: "",
      max_atmosphering_speed: "",
      crew: "",
      passengers: "",
      cargo_capacity: "",
      consumables: "",
      hyperdrive_rating: "",
      MGLT: "",
      starship_class: "",
    });
    openCreate();
  };

  const handleCreateSubmit = async () => {
    if (!formData) return;

    setSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/starship`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the data
      await fetchStarshipData();
      closeCreate();
    } catch (err) {
      console.error("Error creating starship:", err);
      alert(err instanceof Error ? err.message : "Failed to create starship");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStarshipData();
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(timer);
  }, [page, recordsPerPage, sortStatus, searchTerm]);

  return (
    <MantineProvider theme={theme}>
      <div className="app-container">
        <header className="app-header">
          <h3 className="app-title">SW API Starships</h3>
                      {/* Search Input */}
          <Group mb="md" className="app-search" >
            <TextInput
              placeholder="Search starships..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.currentTarget.value);
                setPage(1); // Reset to first page when searching
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
            <Button
              variant="filled"
              color="blue"
              onClick={handleCreateNew}
            >
              Add New Starship
            </Button>
          </Group>
        </header>

        <main className="main-content">


          {/* View Modal */}
          <Modal
            opened={viewOpened}
            onClose={closeView}
            title="Starship Details"
            size="lg"
          >
            {selectedStarship && (
              <Stack gap="md">
                <Grid gutter="xs">
                  <GridCol span={4}><Text fw={600}>Name:</Text></GridCol>
                  <GridCol span={8}><Text>{selectedStarship.name}</Text></GridCol>

                  <GridCol span={4}><Text fw={600}>Model:</Text></GridCol>
                  <GridCol span={8}><Text>{selectedStarship.model}</Text></GridCol>

                  <GridCol span={4}><Text fw={600}>Manufacturer:</Text></GridCol>
                  <GridCol span={8}><Text>{selectedStarship.manufacturer}</Text></GridCol>

                  <GridCol span={4}><Text fw={600}>Cost:</Text></GridCol>
                  <GridCol span={8}><Text>{selectedStarship.cost_in_credits} credits</Text></GridCol>

                  <GridCol span={4}><Text fw={600}>Length:</Text></GridCol>
                  <GridCol span={8}><Text>{selectedStarship.length} meters</Text></GridCol>

                  <GridCol span={4}><Text fw={600}>Max Speed:</Text></GridCol>
                  <GridCol span={8}><Text>{selectedStarship.max_atmosphering_speed}</Text></GridCol>

                  <GridCol span={4}><Text fw={600}>Crew:</Text></GridCol>
                  <GridCol span={8}><Text>{selectedStarship.crew}</Text></GridCol>

                  <GridCol span={4}><Text fw={600}>Passengers:</Text></GridCol>
                  <GridCol span={8}><Text>{selectedStarship.passengers}</Text></GridCol>

                  <GridCol span={4}><Text fw={600}>Cargo Capacity:</Text></GridCol>
                  <GridCol span={8}><Text>{selectedStarship.cargo_capacity}</Text></GridCol>

                  <GridCol span={4}><Text fw={600}>Consumables:</Text></GridCol>
                  <GridCol span={8}><Text>{selectedStarship.consumables}</Text></GridCol>

                  <GridCol span={4}><Text fw={600}>Hyperdrive Rating:</Text></GridCol>
                  <GridCol span={8}><Text>{selectedStarship.hyperdrive_rating}</Text></GridCol>

                  <GridCol span={4}><Text fw={600}>MGLT:</Text></GridCol>
                  <GridCol span={8}><Text>{selectedStarship.MGLT}</Text></GridCol>

                  <GridCol span={4}><Text fw={600}>Class:</Text></GridCol>
                  <GridCol span={8}><Text>{selectedStarship.starship_class}</Text></GridCol>
                </Grid>
                <Group justify="flex-end">
                  <Button onClick={closeView}>Close</Button>
                </Group>
              </Stack>
            )}
          </Modal>

          {/* Edit Modal */}
          <Modal
            opened={editOpened}
            onClose={closeEdit}
            title="Edit Starship"
            size="lg"
          >
            {formData && (
              <form onSubmit={(e) => { e.preventDefault(); handleEditSubmit(); }}>
                <Stack gap="md">
                  <TextInput
                    label="Name"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    required
                  />
                  <TextInput
                    label="Model"
                    value={formData.model}
                    onChange={(e) => handleFormChange("model", e.target.value)}
                    required
                  />
                  <TextInput
                    label="Manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => handleFormChange("manufacturer", e.target.value)}
                    required
                  />
                  <TextInput
                    label="Cost in Credits"
                    value={formData.cost_in_credits}
                    onChange={(e) => handleFormChange("cost_in_credits", e.target.value)}
                  />
                  <TextInput
                    label="Length"
                    value={formData.length}
                    onChange={(e) => handleFormChange("length", e.target.value)}
                  />
                  <TextInput
                    label="Max Atmosphering Speed"
                    value={formData.max_atmosphering_speed}
                    onChange={(e) => handleFormChange("max_atmosphering_speed", e.target.value)}
                  />
                  <TextInput
                    label="Crew"
                    value={formData.crew}
                    onChange={(e) => handleFormChange("crew", e.target.value)}
                  />
                  <TextInput
                    label="Passengers"
                    value={formData.passengers}
                    onChange={(e) => handleFormChange("passengers", e.target.value)}
                  />
                  <TextInput
                    label="Cargo Capacity"
                    value={formData.cargo_capacity}
                    onChange={(e) => handleFormChange("cargo_capacity", e.target.value)}
                  />
                  <TextInput
                    label="Consumables"
                    value={formData.consumables}
                    onChange={(e) => handleFormChange("consumables", e.target.value)}
                  />
                  <TextInput
                    label="Hyperdrive Rating"
                    value={formData.hyperdrive_rating}
                    onChange={(e) => handleFormChange("hyperdrive_rating", e.target.value)}
                  />
                  <TextInput
                    label="MGLT"
                    value={formData.MGLT}
                    onChange={(e) => handleFormChange("MGLT", e.target.value)}
                  />
                  <TextInput
                    label="Starship Class"
                    value={formData.starship_class}
                    onChange={(e) => handleFormChange("starship_class", e.target.value)}
                  />

                  <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={closeEdit} disabled={submitting}>
                      Cancel
                    </Button>
                    <Button type="submit" loading={submitting}>
                      Save Changes
                    </Button>
                  </Group>
                </Stack>
              </form>
            )}
          </Modal>

          {/* Create Modal */}
          <Modal
            opened={createOpened}
            onClose={closeCreate}
            title="Add New Starship"
            size="lg"
          >
            {formData && (
              <form onSubmit={(e) => { e.preventDefault(); handleCreateSubmit(); }}>
                <Stack gap="md">
                  <TextInput
                    label="Name"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    required
                  />
                  <TextInput
                    label="Model"
                    value={formData.model}
                    onChange={(e) => handleFormChange("model", e.target.value)}
                    required
                  />
                  <TextInput
                    label="Manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => handleFormChange("manufacturer", e.target.value)}
                    required
                  />
                  <TextInput
                    label="Cost in Credits"
                    value={formData.cost_in_credits}
                    onChange={(e) => handleFormChange("cost_in_credits", e.target.value)}
                  />
                  <TextInput
                    label="Length"
                    value={formData.length}
                    onChange={(e) => handleFormChange("length", e.target.value)}
                  />
                  <TextInput
                    label="Max Atmosphering Speed"
                    value={formData.max_atmosphering_speed}
                    onChange={(e) => handleFormChange("max_atmosphering_speed", e.target.value)}
                  />
                  <TextInput
                    label="Crew"
                    value={formData.crew}
                    onChange={(e) => handleFormChange("crew", e.target.value)}
                  />
                  <TextInput
                    label="Passengers"
                    value={formData.passengers}
                    onChange={(e) => handleFormChange("passengers", e.target.value)}
                  />
                  <TextInput
                    label="Cargo Capacity"
                    value={formData.cargo_capacity}
                    onChange={(e) => handleFormChange("cargo_capacity", e.target.value)}
                  />
                  <TextInput
                    label="Consumables"
                    value={formData.consumables}
                    onChange={(e) => handleFormChange("consumables", e.target.value)}
                  />
                  <TextInput
                    label="Hyperdrive Rating"
                    value={formData.hyperdrive_rating}
                    onChange={(e) => handleFormChange("hyperdrive_rating", e.target.value)}
                  />
                  <TextInput
                    label="MGLT"
                    value={formData.MGLT}
                    onChange={(e) => handleFormChange("MGLT", e.target.value)}
                  />
                  <TextInput
                    label="Starship Class"
                    value={formData.starship_class}
                    onChange={(e) => handleFormChange("starship_class", e.target.value)}
                  />

                  <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={closeCreate} disabled={submitting}>
                      Cancel
                    </Button>
                    <Button type="submit" loading={submitting}>
                      Create Starship
                    </Button>
                  </Group>
                </Stack>
              </form>
            )}
          </Modal>

          {/* Delete Modal */}
          <Modal
            opened={deleteOpened}
            onClose={closeDelete}
            title="Delete Starship"
            size="md"
          >
            {selectedStarship && (
              <Stack gap="md">
                <Text>
                  Are you sure you want to delete <Text span fw={600}>{selectedStarship.name}</Text>?
                  This action cannot be undone.
                </Text>
                <Group justify="flex-end" mt="md">
                  <Button variant="default" onClick={closeDelete} disabled={submitting}>
                    Cancel
                  </Button>
                  <Button color="red" onClick={handleDelete} loading={submitting}>
                    Delete
                  </Button>
                </Group>
              </Stack>
            )}
          </Modal>

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
            records={starshipData}
          />
        </main>
      </div>
    </MantineProvider>
  );
}

export default App;
