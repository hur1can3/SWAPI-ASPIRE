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
import { ValidationError, type ValidationErrors } from "../services/starshipApi";

interface StarshipFormModalProps {
  opened: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialData: Starship | null;
  onSubmit: (data: Starship) => Promise<void>;
}

const formFields: { label: string; key: keyof Starship; serverKey: string; required?: boolean }[] = [
  { label: "Name", key: "name", serverKey: "Name", required: true },
  { label: "Model", key: "model", serverKey: "Model", required: true },
  { label: "Manufacturer", key: "manufacturer", serverKey: "Manufacturer", required: true },
  { label: "Cost in Credits", key: "cost_in_credits", serverKey: "CostInCredits" },
  { label: "Length", key: "length", serverKey: "Length" },
  { label: "Max Atmosphering Speed", key: "max_atmosphering_speed", serverKey: "MaxAtmospheringSpeed" },
  { label: "Crew", key: "crew", serverKey: "Crew" },
  { label: "Passengers", key: "passengers", serverKey: "Passengers" },
  { label: "Cargo Capacity", key: "cargo_capacity", serverKey: "CargoCapacity" },
  { label: "Consumables", key: "consumables", serverKey: "Consumables" },
  { label: "Hyperdrive Rating", key: "hyperdrive_rating", serverKey: "HyperdriveRating" },
  { label: "MGLT", key: "MGLT", serverKey: "MGLT" },
  { label: "Starship Class", key: "starship_class", serverKey: "StarshipClass" },
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
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});

  // Reset form when modal opens with new initialData
  useEffect(() => {
    if (opened && initialData) {
      setFormData({ ...initialData });
      setFormError(null);
      setFieldErrors({});
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
    setFieldErrors({});
    try {
      await onSubmit(formData);
    } catch (err) {
      if (err instanceof ValidationError) {
        setFieldErrors(err.errors);
        setFormError(err.message);
      } else {
        setFormError(err instanceof Error ? err.message : `Failed to ${mode} starship`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getFieldError = (serverKey: string): string | undefined => {
    const errors = fieldErrors[serverKey];
    return errors?.length ? errors.join(", ") : undefined;
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
            {formFields.map(({ label, key, serverKey, required }) => (
              <TextInput
                key={key}
                label={label}
                value={String(formData[key])}
                onChange={(e) => handleChange(key, e.target.value)}
                required={required}
                error={getFieldError(serverKey)}
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
