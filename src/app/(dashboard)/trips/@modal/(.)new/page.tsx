import NewTripPage from "../../new/page";
import { Modal } from "@/components/shared/modal";

export default function NewTripModal() {
  return (
    <Modal maxWidthClass="max-w-3xl">
      <div className="max-h-[90vh] overflow-y-auto">
        <NewTripPage />
      </div>
    </Modal>
  );
}
