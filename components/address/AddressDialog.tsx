"use client";

import { AddressDocument, AddressFormValues } from "@/lib/address";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddressForm from "./AddressForm";

interface AddressDialogProps {
  open: boolean;
  address?: AddressDocument | null;
  defaultEmail?: string;
  defaultFullName?: string;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AddressFormValues) => Promise<void>;
}

const AddressDialog = ({
  open,
  address,
  defaultEmail,
  defaultFullName,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: AddressDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{address ? "Edit Address" : "Add New Address"}</DialogTitle>
        </DialogHeader>
        <AddressForm
          key={address?._id || "new-address"}
          address={address}
          defaultEmail={defaultEmail}
          defaultFullName={defaultFullName}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddressDialog;
