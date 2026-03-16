import { useState } from "react";
import {
  Alert,
  Button,
  Group,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import type { Starship } from "../types/Starship";

interface StarshipDeleteModalProps {
  opened: boolean;
  onClose: () => void;
  starship: Starship | null;
  onConfirm: (starship: Starship) => Promise<void>;
}

export function StarshipDeleteModal({
  opened,
  onClose,
  starship,
  onConfirm,
}: StarshipDeleteModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!starship) return;
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(starship);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete starship");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Delete Starship" size="md">
      {starship && (
        <Stack gap="md">
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              withCloseButton
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}
          <Text>
            Are you sure you want to delete <Text span fw={600}>{starship.name}</Text>?
            This action cannot be undone.
          </Text>
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button color="red" onClick={handleDelete} loading={submitting}>
              Delete
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
}
