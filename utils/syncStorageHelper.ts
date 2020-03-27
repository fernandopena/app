
import { postRecords } from '../api/services';
import { getLocalDiagnostics, deleteLocalDiagnostics } from './localStorageHelper';

export async function syncLocalDataWithServer() {
  syncRecordsDataWithServer();
}



export async function syncRecordsDataWithServer() {
  try {
    const diagnostics = await getLocalDiagnostics();
    if (diagnostics && diagnostics.length) {
      await postRecords(diagnostics);
      await deleteLocalDiagnostics();
    }
  } catch (error) {
    console.log(error);
  }
}
