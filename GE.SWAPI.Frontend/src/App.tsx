import { useState, useEffect } from "react";
import "./layout.css";
import { ActionIcon, Box, Group, MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import "./App.css";
import { DataTable } from "mantine-datatable";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface Starship {
  name: string;
}

function App() {
  const [starshipData, setStarshipData] = useState<Starship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStarshipData = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL; // Provided by Aspire
      const response = await fetch(`${apiUrl}/starship`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Starship[] = await response.json();
      setStarshipData(data);
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
    action: string;
  }) => {
    alert(`Action: ${action} on ${starship.name}`);
  };

  useEffect(() => {
    fetchStarshipData();
  }, []);

  return (
    <MantineProvider theme={theme}>
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">SW API Starships</h1>
        </header>

        <main className="main-content">
          <DataTable
            withRowBorders={true}
            withColumnBorders={true}
            highlightOnHover={true}
            columns={[
              {
                accessor: "id",
                footer: (
                  <Group gap="xs">
                    <Box mb={-4}>
                      <div>{starshipData.length} starships</div>
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
              {
                accessor: "actions",
                title: <Box mr={6}>Actions</Box>,
                textAlign: "right",
                render: (company) => (
                  <Group gap={4} justify="right" wrap="nowrap">
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="blue"
                      onClick={() => showModal({ company, action: "edit" })}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="red"
                      onClick={() => showModal({ company, action: "delete" })}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                ),
              },
            ]}
            records={starshipData}
          />
        </main>
      </div>
    </MantineProvider>
  );
}

export default App;
