import { VehicleStepForm } from "@/components/funnel/VehicleStepForm";
import { ConditionStepForm } from "@/components/funnel/ConditionStepForm";
import { ContactStepForm } from "@/components/funnel/ContactStepForm";
import { AppointmentStepForm } from "@/components/funnel/AppointmentStepForm";
import { PhotoStepForm } from "@/components/funnel/PhotoStepForm";
import type { ValuationData } from "@/lib/valuation-schema";

interface Props {
  step: number;
  data: ValuationData;
  submitting: boolean;
  onVehicle: (d: ValuationData) => void;
  onCondition: (d: ValuationData) => void;
  onPhotos: (d: ValuationData) => void;
  onContact: (d: ValuationData) => void;
  onAppointment: (d: ValuationData) => void;
  onBack: (target: number) => void;
}

export const FunnelStepRouter = ({
  step,
  data,
  submitting,
  onVehicle,
  onCondition,
  onPhotos,
  onContact,
  onAppointment,
  onBack,
}: Props) => {
  if (step === 0) return <VehicleStepForm defaults={data} onNext={onVehicle} />;
  if (step === 1)
    return (
      <ConditionStepForm defaults={data} onNext={onCondition} onBack={() => onBack(0)} />
    );
  if (step === 2)
    return (
      <PhotoStepForm
        defaults={{ photoUrls: data.photoUrls }}
        onNext={onPhotos}
        onBack={() => onBack(1)}
      />
    );
  if (step === 3)
    return (
      <ContactStepForm defaults={data} onNext={onContact} onBack={() => onBack(2)} />
    );
  if (step === 4)
    return (
      <AppointmentStepForm
        defaults={data}
        onSubmit={onAppointment}
        onBack={() => onBack(3)}
        submitting={submitting}
      />
    );
  return null;
};