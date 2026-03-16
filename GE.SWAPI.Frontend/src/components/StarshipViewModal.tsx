import {
  Button,
  Grid,
  GridCol,
  Group,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import type { Starship } from "../types/Starship";

interface StarshipViewModalProps {
  opened: boolean;
  onClose: () => void;
  starship: Starship | null;
}

const fields: { label: string; key: keyof Starship; suffix?: string }[] = [
  { label: "Name", key: "name" },
  { label: "Model", key: "model" },
  { label: "Manufacturer", key: "manufacturer" },
  { label: "Cost In Credits", key: "cost_in_credits", suffix: " credits" },
  { label: "Length", key: "length", suffix: " meters" },
  { label: "Max Speed", key: "max_atmosphering_speed" },
  { label: "Crew", key: "crew" },
  { label: "Passengers", key: "passengers" },
  { label: "Cargo Capacity", key: "cargo_capacity" },
  { label: "Consumables", key: "consumables" },
  { label: "Hyperdrive Rating", key: "hyperdrive_rating" },
  { label: "MGLT", key: "MGLT" },
  { label: "Class", key: "starship_class" },
];

export function StarshipViewModal({ opened, onClose, starship }: StarshipViewModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Starship Details" size="lg">
      {starship && (
        <Stack gap="md">
          <Grid gutter="xs">
            {fields.map(({ label, key, suffix }) => (
              <Grid.Col span={12} key={key}>
                <Grid gutter="xs">
                  <GridCol span={4}><Text fw={600}>{label}:</Text></GridCol>
                  <GridCol span={8}><Text>{String(starship[key])}{suffix ?? ""}</Text></GridCol>
                </Grid>
              </Grid.Col>
            ))}
          </Grid>
          <Group justify="flex-end">
            <Button onClick={onClose}>Close</Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
}
