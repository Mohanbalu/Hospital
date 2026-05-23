import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import FormInput from '../../components/FormInput';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import { deleteDoctor, getDoctors, searchDoctorsBySpecialization } from '../../services/doctorService';
import useDebounce from '../../hooks/useDebounce';
import { formatCurrency, formatFullName } from '../../utils/formatters';
import { getErrorMessage } from '../../utils/errors';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const debouncedSearch = useDebounce(search, 350);
  const pageSize = 6;

  const loadDoctors = async (query = '') => {
    try {
      setLoading(true);
      const data = query ? await searchDoctorsBySpecialization(query) : await getDoctors();
      setDoctors(Array.isArray(data) ? data : []);
      setPage(1);
    } catch (doctorError) {
      setError(getErrorMessage(doctorError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors(debouncedSearch.trim());
  }, [debouncedSearch]);

  const pagedDoctors = useMemo(() => {
    const start = (page - 1) * pageSize;
    return doctors.slice(start, start + pageSize);
  }, [doctors, page]);

  const totalPages = Math.max(1, Math.ceil(doctors.length / pageSize));

  const handleDelete = async () => {
    if (!selectedDoctor) {
      return;
    }

    try {
      await deleteDoctor(selectedDoctor.id);
      setConfirmOpen(false);
      setSelectedDoctor(null);
      await loadDoctors(debouncedSearch.trim());
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Doctor',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{formatFullName(row.firstName, row.lastName)}</p>
          <p className="text-xs text-slate-500">{row.email}</p>
        </div>
      ),
    },
    { key: 'specialization', header: 'Specialization' },
    { key: 'departmentName', header: 'Department' },
    { key: 'consultationFee', header: 'Fee', render: (row) => formatCurrency(row.consultationFee) },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Link to={`/doctors/${row.id}/edit`} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100">
            Edit
          </Link>
          <button
            type="button"
            onClick={() => {
              setSelectedDoctor(row);
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
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Doctors</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Doctor records</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Search by specialization and manage clinical staff records.</p>
          </div>
          <Link to="/doctors/new">
            <Button>Add doctor</Button>
          </Link>
        </div>
        <div className="mt-6 max-w-md">
          <FormInput label="Search specialization" placeholder="Cardiology, Orthopedics, Pediatrics..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
      </div>

      {error ? <Alert type="error" title="Doctor operation failed" message={error} /> : null}
      {loading ? <Loader fullScreen /> : null}

      {!loading && doctors.length === 0 ? (
        <EmptyState
          title="No doctor records"
          description="Create doctor profiles to assign appointments and manage clinical availability."
          actionLabel="Add doctor"
          onAction={() => (window.location.href = '/doctors/new')}
        />
      ) : null}

      {!loading && doctors.length > 0 ? (
        <>
          <Table columns={columns} data={pagedDoctors} emptyMessage="No doctors on this page" />
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <p>
              Showing {Math.min(pagedDoctors.length, doctors.length)} of {doctors.length} doctors
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
        title="Delete doctor"
        description={`Delete ${selectedDoctor ? formatFullName(selectedDoctor.firstName, selectedDoctor.lastName) : 'this doctor'}?`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
