import { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Group,
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import type { Starship } from "../types/Starship";

interface StarshipFormModalProps {
  opened: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialData: Starship | null;
  onSubmit: (data: Starship) => Promise<void>;
}

const formFields: { label: string; key: keyof Starship; required?: boolean }[] = [
  { label: "Name", key: "name", required: true },
  { label: "Model", key: "model", required: true },
  { label: "Manufacturer", key: "manufacturer", required: true },
  { label: "Cost in Credits", key: "cost_in_credits" },
  { label: "Length", key: "length" },
  { label: "Max Atmosphering Speed", key: "max_atmosphering_speed" },
  { label: "Crew", key: "crew" },
  { label: "Passengers", key: "passengers" },
  { label: "Cargo Capacity", key: "cargo_capacity" },
  { label: "Consumables", key: "consumables" },
  { label: "Hyperdrive Rating", key: "hyperdrive_rating" },
  { label: "MGLT", key: "MGLT" },
  { label: "Starship Class", key: "starship_class" },
];

export function StarshipFormModal({
  opened,
  onClose,
  mode,
  initialData,
  onSubmit,
}: StarshipFormModalProps) {
  const [formData, setFormData] = useState<Starship | null>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Reset form when modal opens with new initialData
  useEffect(() => {
    if (opened && initialData) {
      setFormData({ ...initialData });
      setFormError(null);
    }
  }, [opened, initialData]);

  const handleChange = (field: keyof Starship, value: string) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSubmit = async () => {
    if (!formData) return;
    setSubmitting(true);
    setFormError(null);
    try {
      await onSubmit(formData);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : `Failed to ${mode} starship`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={mode === "edit" ? "Edit Starship" : "Add New Starship"}
      size="lg"
    >
      {formData && (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <Stack gap="md">
            {formError && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                withCloseButton
                onClose={() => setFormError(null)}
              >
                {formError}
              </Alert>
            )}
            {formFields.map(({ label, key, required }) => (
              <TextInput
                key={key}
                label={label}
                value={String(formData[key])}
                onChange={(e) => handleChange(key, e.target.value)}
                required={required}
              />
            ))}
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                {mode === "edit" ? "Save Changes" : "Create Starship"}
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Modal>
  );
}
