
//JS
import React from 'react';
import moment from 'moment';
import Table from '@mui/material/Table';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { CardContent } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import DoNotDisturbAltRoundedIcon from '@mui/icons-material/DoNotDisturbAltRounded';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import { ToastContainer, toast } from 'react-toastify';
//CSS
import 'react-toastify/dist/ReactToastify.css';

function App() {
// State for entry attributes
const [entry, setEntry] = React.useState({
  title: '',
  description: '',
  deadline: '',
  priority: '',
  complete: false,
});

// Dialog and UI State
const [openTask, setOpenTask] = React.useState(false);
const [updateOpen, setUpdateOpen] = React.useState(false);
const [error, setError] = React.useState(false);

// Indices and Entries State
const [storedIndex, setStoredIndex] = React.useState(-1);
const [arrayEntries, setArrayEntries] = React.useState([]);

// Validation State
const [titleValidator, setTitleValidator] = React.useState('');
const [descriptionValidator, setDescriptionValidator] = React.useState('');

// Toast Notification Functions
const addingSuccess = () => toast.success('Task successfully added');
const updatingSuccess = () => toast.success('Task successfully updated');
const deletingSuccess = () => toast.success('Task successfully deleted');

// Dialog Handling Functions
const handleClickOpen = () => setOpenTask(true);
const handleClickClosed = () => setOpenTask(false);
const handleUpdateClickOpen = () => setUpdateOpen(true);
const handleUpdateClickClosed = () => setUpdateOpen(false);

// Reset Function
const reset = () => {
  setEntry({ title: '', description: '', deadline: '', priority: '' });
  setError(false);
  setTitleValidator('');
  setDescriptionValidator('');
};

// Entry Field Update Functions
const changeTitle = (value) => {
  setEntry({ ...entry, title: value.target.value });
};

const changeDescription = (value) => {
  setEntry({ ...entry, description: value.target.value });
};

// Validation Functions
const validateTitle = (value) => {
  setError(false);
  let errors = [];
  if (!value) {
    errors.push('Error: Title is required');
    setError(true);
  }
  if (arrayEntries.some((e) => e.title === value)) {
    errors.push('Error: Duplicate title. Please enter a different title.');
    setError(true);
  }
  const errorMessage = errors.join();
  setTitleValidator(errorMessage);
  return errorMessage;
};

const validateDescription = (value) => {
  setError(false);
  let errors = [];
  if (!value) {
    errors.push('Description is required!');
    setError(true);
  }
  const errorMessage = errors.join();
  setDescriptionValidator(errorMessage);
  return errorMessage;
};

// Entry Manipulation Functions
const createEntry = () => {
  setArrayEntries([...arrayEntries, entry]);
  reset();
  addingSuccess();
};

const add = () => {
  if (validateTitle(entry.title) || validateDescription(entry.description)) return;
  createEntry();
  handleClickClosed();
  handleUpdateClickClosed();
};

const changeEntry = () => {
  const newEntries = arrayEntries.map((e, i) => 
    i === storedIndex ? {...entry, complete: e.complete} : e
  );
  setArrayEntries(newEntries);
  reset();
  updatingSuccess();
};

const editSubmit = () => {
  if (validateDescription(entry.description)) return;
  changeEntry();
  handleClickClosed();
  handleUpdateClickClosed();
};

const updateValues = (index) => {
  setStoredIndex(index);
  setEntry(arrayEntries[index]);
};

const toggleCheckbox = (index) => () => {
  const newEntries = arrayEntries.map((e, i) => 
    i === index ? {...e, complete: !e.complete} : e
  );
  setArrayEntries(newEntries);
};

const deleteEntry = (index) => {
  const newEntries = arrayEntries.filter((_, i) => i !== index);
  setArrayEntries(newEntries);
  deletingSuccess();
};


return (
  <>
    {/* Task Dialog */}
    <Dialog open={openTask || updateOpen} onClose={handleClickClosed || handleUpdateClickClosed}>
      <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
        {openTask ? 'Add Task' : 'Edit Task'}
      </DialogTitle>
      
      <DialogContent>
        {/* Conditional rendering for Add Task specific fields */}
        {openTask && (
          <>
            <TextField
              error={error}
              sx={{ width: 1 }}
              id="titleinput"
              label="Title"
              placeholder="Type title..."
              helperText={titleValidator}
              value={entry.title}
              onChange={changeTitle}
            />
            <br /><br />
          </>
        )}

        {/* Description Input */}
        <TextField
          error={error}
          sx={{ width: 1 }}
          id="descriptioninput"
          label="Description"
          placeholder="Type description..."
          helperText={descriptionValidator}
          value={entry.description}
          onChange={changeDescription}
          InputLabelProps={updateOpen && { shrink: true }}
        />
        <br /><br />

        {/* Deadline Picker */}
        <TextField
          type="date"
          defaultValue="01/01/2022"
          id="dateInput"
          value={entry.deadline}
          onChange={(e) => setEntry({ ...entry, deadline: e.target.value })}
          label="Deadline"
          style={{ display: 'block' }}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <br />

        {/* Priority Selection */}
        <div>
          Priority
          <RadioGroup
            row
            value={entry.priority}
            onChange={(e) => setEntry({ ...entry, priority: e.target.value })}
          >
            <FormControlLabel value="low" control={<Radio />} label="Low" />
            <FormControlLabel value="med" control={<Radio />} label="Medium" />
            <FormControlLabel value="high" control={<Radio />} label="High" />
          </RadioGroup>
        </div>
      </DialogContent>

      <DialogActions sx={{ bgcolor: 'white' }}>
        <Button
          onClick={openTask ? add : editSubmit}
          variant="contained"
          sx={{ width: '35%' }}
          autoFocus
        >
          {openTask ? <AddCircleIcon fontSize='small' /> : <EditIcon fontSize='small' />} 
          {openTask ? 'Add' : 'Update'}
        </Button>

        <Button
          onClick={() => {
            handleClickClosed(); 
            handleUpdateClickClosed();  
            reset();
          }}
          variant="contained"
          sx={{ bgcolor: 'red', width: '35%' }}
          autoFocus
        >
          <DoNotDisturbAltRoundedIcon fontSize="small" />
          CANCEL
        </Button>
      </DialogActions>
    </Dialog>

    {/* Tasks Display Card */}
    <Card sx={{ margin: '0.5%' }}>
      <CardHeader
        sx={{ bgcolor: 'primary.dark', color: 'white' }}
        title={<><MenuIcon /> FRAMEWORKS</>}
        style={{ textAlign: 'center' }}
        action={
          <Button
            variant="contained"
            onClick={handleClickOpen}
            sx={{ marginRight: '20px' }}
          >
            <AddCircleIcon />
            &nbsp; ADD
          </Button>
        }
      />

      <CardContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ color: 'gray' }}>Title</TableCell>
                <TableCell align="center" sx={{ color: 'gray' }}>Description</TableCell>
                <TableCell align="center" sx={{ color: 'gray' }}>Deadline</TableCell>
                <TableCell align="center" sx={{ color: 'gray' }}>Priority</TableCell>
                <TableCell align="center" sx={{ color: 'gray' }}>Is Complete</TableCell>
                <TableCell align="center" sx={{ color: 'gray' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {arrayEntries.map((entry, index) => (
                <TableRow key={entry.title}>
                  <TableCell align="center">{entry.title}</TableCell>
                  <TableCell align="center">{entry.description}</TableCell>
                  <TableCell align="center">{moment(entry.deadline).format('MM/DD/YY')}</TableCell>
                  <TableCell align="center">{entry.priority}</TableCell>
                  <TableCell align="center">
                    <Checkbox onChange={toggleCheckbox(index)} checked={entry.complete} />
                  </TableCell>
                  <TableCell align="center">
                    <div>
                      {!entry.complete && (
                        <Button
                          variant="contained"
                          sx={{ width: '50%' }}
                          onClick={() => {
                            updateValues(index);
                            handleUpdateClickOpen();
                          }}
                        >
                          <EditIcon />
                          &nbsp;Update
                        </Button>
                      )}
                      <Button
                        color="error"
                        variant="contained"
                        onClick={() => deleteEntry(index)}
                        sx={{ bgcolor: '#f44336', width: '50%', marginTop: !entry.complete ? 2 : 0 }}
                      >
                        <CancelIcon />
                        &nbsp;Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>

    {/* Toast Notifications Container */}
    <ToastContainer position="bottom-right" autoClose={2500} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
  </>
);

}
export default App;

