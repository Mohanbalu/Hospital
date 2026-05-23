import { useEffect, useMemo, useState } from 'react';
import { FiFileText } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';
import Table from '../../components/Table';
import { getPrescriptionByAppointment, getPrescriptionsByPatient } from '../../services/prescriptionService';
import { formatDateTime } from '../../utils/formatters';
import { getErrorMessage } from '../../utils/errors';

const columns = [
  { key: 'appointmentId', header: 'Appointment ID' },
  { key: 'patientId', header: 'Patient ID' },
  { key: 'doctorId', header: 'Doctor ID' },
  { key: 'diagnosis', header: 'Diagnosis' },
  { key: 'medication', header: 'Medication' },
  { key: 'prescribedAt', header: 'Prescribed', render: (row) => formatDateTime(row.prescribedAt) },
];

export default function PrescriptionList() {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');
  const appointmentId = searchParams.get('appointmentId');
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(Boolean(patientId || appointmentId));
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPrescriptions = async () => {
      if (!patientId && !appointmentId) {
        setLoading(false);
        setPrescriptions([]);
        return;
      }

      try {
        setLoading(true);
        setError('');

        if (patientId) {
          const response = await getPrescriptionsByPatient(patientId);
          setPrescriptions(Array.isArray(response) ? response : []);
        } else {
          const response = await getPrescriptionByAppointment(appointmentId);
          setPrescriptions(response ? [response] : []);
        }
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        setLoading(false);
      }
    };

    loadPrescriptions();
  }, [appointmentId, patientId]);

  const helperText = useMemo(() => {
    if (patientId) {
      return `Showing prescriptions for patient ${patientId}`;
    }

    if (appointmentId) {
      return `Showing the prescription for appointment ${appointmentId}`;
    }

    return 'Open this page with a patientId or appointmentId query parameter to load live data from the backend.';
  }, [appointmentId, patientId]);

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="card-shell p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Prescriptions</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Clinical prescriptions</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">{helperText}</p>
          </div>
          <Button>
            <FiFileText />
            Create prescription
          </Button>
        </div>
      </div>

      {error ? <Alert type="error" title="Unable to load prescriptions" message={error} /> : null}
      {loading ? <Loader fullScreen /> : null}

      {!loading && prescriptions.length === 0 ? (
        <EmptyState
          title="No prescriptions loaded"
          description="Provide a patientId or appointmentId in the URL to fetch live prescription data."
          actionLabel="Back to appointments"
          onAction={() => (window.location.href = '/appointments')}
        />
      ) : null}

      {!loading && prescriptions.length > 0 ? <Table columns={columns} data={prescriptions} emptyMessage="No prescriptions available" /> : null}
    </div>
  );
}
