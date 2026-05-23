import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import FormInput from '../../components/FormInput';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import { deletePatient, getPatients, searchPatients } from '../../services/patientService';
import useDebounce from '../../hooks/useDebounce';
import { formatDate, formatFullName } from '../../utils/formatters';
import { getErrorMessage } from '../../utils/errors';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const debouncedSearch = useDebounce(search, 350);
  const pageSize = 6;

  const loadPatients = async (query = '') => {
    try {
      setLoading(true);
      const data = query ? await searchPatients(query) : await getPatients();
      setPatients(Array.isArray(data) ? data : []);
      setPage(1);
    } catch (patientsError) {
      setError(getErrorMessage(patientsError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients(debouncedSearch.trim());
  }, [debouncedSearch]);

  const pagedPatients = useMemo(() => {
    const start = (page - 1) * pageSize;
    return patients.slice(start, start + pageSize);
  }, [patients, page]);

  const totalPages = Math.max(1, Math.ceil(patients.length / pageSize));

  const handleDelete = async () => {
    if (!selectedPatient) {
      return;
    }

    try {
      await deletePatient(selectedPatient.id);
      setConfirmOpen(false);
      setSelectedPatient(null);
      await loadPatients(debouncedSearch.trim());
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Patient',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{formatFullName(row.firstName, row.lastName)}</p>
          <p className="text-xs text-slate-500">{row.email}</p>
        </div>
      ),
    },
    { key: 'phoneNumber', header: 'Phone' },
    { key: 'gender', header: 'Gender' },
    { key: 'bloodGroup', header: 'Blood Group' },
    { key: 'createdAt', header: 'Created', render: (row) => formatDate(row.createdAt) },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Link to={`/patients/${row.id}`} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">
            View
          </Link>
          <Link to={`/patients/${row.id}/edit`} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100">
            Edit
          </Link>
          <button
            type="button"
            onClick={() => {
              setSelectedPatient(row);
              setConfirmOpen(true);
            }}
            className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="card-shell p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Patients</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Patient records</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Search, review, and maintain patient profiles from a clean administrative view.</p>
          </div>
          <Link to="/patients/new">
            <Button>Add patient</Button>
          </Link>
        </div>
        <div className="mt-6 max-w-md">
          <FormInput
            label="Search patients"
            placeholder="Search by first or last name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {error ? <Alert type="error" title="Patient operation failed" message={error} /> : null}
      {loading ? <Loader fullScreen /> : null}

      {!loading && patients.length === 0 ? (
        <EmptyState
          title="No patient records"
          description="Add a patient to begin managing hospital visits and appointments."
          actionLabel="Add patient"
          onAction={() => (window.location.href = '/patients/new')}
        />
      ) : null}

      {!loading && patients.length > 0 ? (
        <>
          <Table columns={columns} data={pagedPatients} emptyMessage="No patients on this page" />
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <p>
              Showing {Math.min(pagedPatients.length, patients.length)} of {patients.length} patients
            </p>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
                Previous
              </Button>
              <span className="px-2 text-sm font-semibold text-slate-700">
                Page {page} of {totalPages}
              </span>
              <Button variant="secondary" size="sm" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}>
                Next
              </Button>
            </div>
          </div>
        </>
      ) : null}

      <Modal
        isOpen={confirmOpen}
        title="Delete patient"
        description={`Delete ${selectedPatient ? formatFullName(selectedPatient.firstName, selectedPatient.lastName) : 'this patient'}? This action cannot be undone.`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
