import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { deletePatient, getPatientById } from '../../services/patientService';
import { formatDate, formatDateTime, formatFullName } from '../../utils/formatters';
import { getErrorMessage } from '../../utils/errors';

export default function ViewPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const loadPatient = async () => {
      try {
        setLoading(true);
        const response = await getPatientById(id);
        setPatient(response);
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deletePatient(id);
      navigate('/patients');
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!patient) {
    return <Alert type="error" title="Patient not found" message={error || 'The requested patient record does not exist.'} />;
  }

  const details = [
    ['Full name', formatFullName(patient.firstName, patient.lastName)],
    ['Email', patient.email],
    ['Phone', patient.phoneNumber],
    ['Gender', patient.gender],
    ['Date of birth', formatDate(patient.dateOfBirth)],
    ['Blood group', patient.bloodGroup],
    ['Emergency contact', patient.emergencyContactName || '-'],
    ['Emergency phone', patient.emergencyContactPhone || '-'],
    ['Address', patient.address],
    ['Created', formatDateTime(patient.createdAt)],
    ['Updated', formatDateTime(patient.updatedAt)],
  ];

  return (
    <div className="space-y-6 animate-fadeInUp">
      {error ? <Alert type="error" title="Unable to load patient" message={error} /> : null}
      <div className="card-shell p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Patient details</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{formatFullName(patient.firstName, patient.lastName)}</h1>
            <p className="mt-2 text-sm text-slate-500">Full record summary and audit information.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to={`/patients/${id}/edit`}>
              <Button>Edit patient</Button>
            </Link>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              Delete patient
            </Button>
            <Link to="/patients">
              <Button variant="secondary">Back</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {details.map(([label, value]) => (
          <div key={label} className="card-shell p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{value || '-'}</p>
          </div>
        ))}
      </div>

      <Modal
        isOpen={confirmOpen}
        title="Delete patient"
        description="This will permanently remove the patient record from the system."
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
