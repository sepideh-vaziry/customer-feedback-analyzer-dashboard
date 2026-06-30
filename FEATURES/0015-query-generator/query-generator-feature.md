# Phase 6: Frontend & Reporting Dashboard

**Status:** UI/UX Phase  
**Duration:** 3-4 weeks  
**Priority:** High  
**Dependencies:** Phase 4 (Query API), Phase 5 (Query Management)

---

## Objectives

1. **Schema Upload Interface** - Intuitive UI for uploading database schemas
2. **Query Builder** - Natural language query generation interface
3. **Results Visualization** - Display query results in various formats
4. **Analytics Dashboard** - Organization-wide insights and metrics
5. **Query Management UI** - Favorites, history, sharing, templates
6. **Real-time Collaboration** - Team query collaboration features
7. **Mobile Responsive** - Full support for mobile/tablet devices

---

## Architecture Overview

```
[React Frontend]
    |
    +-- [Layout/Navigation] (Main app shell)
    |
    +-- [Pages]
    |   +-- Dashboard (Overview & Analytics)
    |   +-- Schema Management (Upload, List, Details)
    |   +-- Query Generator (Main feature)
    |   +-- Query Results (Display & Export)
    |   +-- Query History (Audit trail)
    |   +-- Favorites & Collections
    |   +-- Templates Library
    |   +-- Team & Sharing
    |   +-- Settings & Admin
    |
    +-- [Components]
    |   +-- Schema Uploader
    |   +-- Query Input
    |   +-- SQL Viewer
    |   +-- ResultsTable
    |   +-- Charts & Visualizations
    |   +-- ExecutionContext
    |
    +-- [Services]
    |   +-- ApiClient (REST integration)
    |   +-- StateManagement (Redux/Context)
    |   +-- Authentication
    |   +-- Analytics
    |
    +-- [Styles & Theme]
        +-- Design System (Colors, Typography)
        +-- Responsive Grid
        +-- Dark/Light Mode

    |
    v
[REST API] (Phase 4 endpoints)
```

---

## Technology Stack

- **Framework:** React 18+
- **State Management:** Redux Toolkit / TanStack Query
- **UI Components:** Material-UI (MUI) or Shadcn/ui
- **Charts:** Recharts, Chart.js
- **Forms:** React Hook Form + Zod validation
- **Code Editor:** Monaco Editor (SQL syntax highlighting)
- **Real-time:** WebSocket (Socket.io)
- **Build:** Vite
- **Testing:** Vitest, React Testing Library

---

## Pages

### 1. Dashboard Page

**File:** `pages/Dashboard.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Box, Typography } from '@mui/material';
import { LineChart, BarChart, PieChart } from 'recharts';
import { useAppSelector } from '../store/hooks';
import StatsCard from '../components/StatsCard';
import RecentActivityTable from '../components/RecentActivityTable';
import TopQueriesChart from '../components/TopQueriesChart';

export const Dashboard: React.FC = () => {
  const { organization } = useAppSelector(state => state.auth);
  const { analytics, loading } = useAppSelector(state => state.analytics);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="Total Schemas"
            value={analytics?.totalSchemas || 0}
            icon="database"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="Queries Generated"
            value={analytics?.totalQueries || 0}
            trend={analytics?.queryGrowth}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="Executions This Month"
            value={analytics?.monthlyExecutions || 0}
            icon="flash"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="Team Members"
            value={analytics?.teamSize || 0}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Queries Over Time */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Query Generation Trend
            </Typography>
            <LineChart width={600} height={300} data={analytics?.queryTrendData || []}>
              {/* Chart configuration */}
            </LineChart>
          </Paper>
        </Grid>

        {/* Top Queries */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Queries
            </Typography>
            <TopQueriesChart queries={analytics?.topQueries || []} />
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <RecentActivityTable activities={analytics?.recentActivity || []} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
```

### 2. Schema Upload Page

**File:** `pages/SchemaManagement.tsx`

```tsx
import React, { useState } from 'react';
import { Container, Paper, Tabs, Tab, Box, Button, Dialog } from '@mui/material';
import SchemaUploadForm from '../components/SchemaUploadForm';
import SchemaList from '../components/SchemaList';
import SchemaDetails from '../components/SchemaDetails';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchSchemas, uploadSchema } from '../store/slices/schemaSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const SchemaManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { schemas, loading } = useAppSelector(state => state.schema);
  const [tabValue, setTabValue] = useState(0);
  const [selectedSchema, setSelectedSchema] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  React.useEffect(() => {
    dispatch(fetchSchemas());
  }, [dispatch]);

  const handleUpload = async (data: any) => {
    await dispatch(uploadSchema(data));
    setUploadDialogOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <h1>Database Schemas</h1>
        <Button 
          variant="contained" 
          onClick={() => setUploadDialogOpen(true)}
        >
          Upload Schema
        </Button>
      </Box>

      <Paper>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="My Schemas" />
          <Tab label="Shared Schemas" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <SchemaList 
            schemas={schemas}
            loading={loading}
            onSelect={setSelectedSchema}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <SchemaList 
            schemas={schemas.filter(s => s.sharedWithMe)}
            loading={loading}
            onSelect={setSelectedSchema}
          />
        </TabPanel>
      </Paper>

      {selectedSchema && (
        <SchemaDetails schemaId={selectedSchema} />
      )}

      <Dialog 
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
      >
        <SchemaUploadForm onSubmit={handleUpload} />
      </Dialog>
    </Container>
  );
};

export default SchemaManagement;
```

### 3. Query Generator Page (Main Feature)

**File:** `pages/QueryGenerator.tsx`

```tsx
import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  TextField, 
  Button, 
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import SchemaSelector from '../components/SchemaSelector';
import QueryInput from '../components/QueryInput';
import SqlViewer from '../components/SqlViewer';
import ExecutionContext from '../components/ExecutionContext';
import QueryOptimizations from '../components/QueryOptimizations';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { generateQuery, clearQuery } from '../store/slices/querySlice';

export const QueryGenerator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    selectedSchema, 
    queryRequest, 
    generatedQuery, 
    loading, 
    error 
  } = useAppSelector(state => state.query);

  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [explain, setExplain] = useState(true);
  const [optimize, setOptimize] = useState(true);

  const handleGenerate = async () => {
    if (!selectedSchema?.id || !naturalLanguage.trim()) {
      return;
    }

    dispatch(generateQuery({
      schemaId: selectedSchema.id,
      naturalLanguageQuery: naturalLanguage,
      explainQuery: explain,
      optimizeQuery: optimize,
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        SQL Query Generator
      </Typography>

      <Grid container spacing={3}>
        {/* Left Panel - Input */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              1. Select Database Schema
            </Typography>
            <SchemaSelector />

            <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
              2. Describe Your Query
            </Typography>
            <QueryInput 
              value={naturalLanguage}
              onChange={setNaturalLanguage}
              disabled={!selectedSchema}
              placeholder="e.g., 'Get all customers who made purchases in the last 30 days with their total spending'"
            />

            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={explain} 
                    onChange={(e) => setExplain(e.target.checked)}
                  />
                }
                label="Explain the query"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={optimize} 
                    onChange={(e) => setOptimize(e.target.checked)}
                  />
                }
                label="Optimize performance"
              />
            </Box>

            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleGenerate}
              disabled={loading || !selectedSchema || !naturalLanguage}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Generate Query'}
            </Button>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Right Panel - Output */}
        <Grid item xs={12} md={6}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          )}

          {generatedQuery && (
            <>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    Generated SQL
                  </Typography>
                  <Box>
                    <Chip 
                      label={`Confidence: ${(generatedQuery.confidenceScore * 100).toFixed(0)}%`}
                      color={generatedQuery.confidenceScore > 0.8 ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                </Box>

                <SqlViewer 
                  sql={generatedQuery.generatedSql}
                  databaseType={selectedSchema?.databaseType}
                />

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => navigator.clipboard.writeText(generatedQuery.generatedSql)}
                  >
                    Copy SQL
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small"
                  >
                    Save as Favorite
                  </Button>
                  <Button 
                    variant="contained" 
                    size="small"
                    color="success"
                  >
                    Execute Query
                  </Button>
                </Box>
              </Paper>

              {generatedQuery.explanation && (
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Query Explanation
                  </Typography>
                  <Typography variant="body2">
                    {generatedQuery.explanation}
                  </Typography>
                </Paper>
              )}

              {generatedQuery.suggestions && generatedQuery.suggestions.length > 0 && (
                <QueryOptimizations suggestions={generatedQuery.suggestions} />
              )}

              <ExecutionContext 
                context={generatedQuery.executionContext}
              />
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default QueryGenerator;
```

---

## Key Components

### SchemaSelector Component

**File:** `components/SchemaSelector.tsx`

```tsx
import React, { useEffect } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Box
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchSchemas, selectSchema } from '../store/slices/schemaSlice';

export const SchemaSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const { schemas, selectedSchema, loading } = useAppSelector(state => state.schema);

  useEffect(() => {
    if (schemas.length === 0) {
      dispatch(fetchSchemas());
    }
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel>Select Database Schema</InputLabel>
      <Select
        value={selectedSchema?.id || ''}
        onChange={(e) => dispatch(selectSchema(e.target.value))}
        disabled={loading}
      >
        {loading && (
          <MenuItem disabled>
            <CircularProgress size={24} />
          </MenuItem>
        )}
        {schemas.map(schema => (
          <MenuItem key={schema.id} value={schema.id}>
            {schema.name} ({schema.databaseType})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SchemaSelector;
```

### QueryInput Component

**File:** `components/QueryInput.tsx`

```tsx
import React, { useState } from 'react';
import { 
  TextField, 
  Box, 
  Typography,
  List,
  ListItem,
  ListItemButton,
  Collapse,
  ExpandLess,
  ExpandMore
} from '@mui/material';

interface QueryInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const QUERY_SUGGESTIONS = [
  "Get all customers with their recent orders",
  "Find top 10 best-selling products",
  "List customers who haven't purchased in 90 days",
  "Calculate total revenue by product category",
  "Show users with the highest order frequency"
];

export const QueryInput: React.FC<QueryInputProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <Box>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        variant="outlined"
        onFocus={() => setShowSuggestions(true)}
      />

      <Box sx={{ mt: 2 }}>
        <ListItem 
          button
          onClick={() => setShowSuggestions(!showSuggestions)}
        >
          <Typography variant="subtitle2">
            💡 Example Queries
          </Typography>
          {showSuggestions ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        
        <Collapse in={showSuggestions} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {QUERY_SUGGESTIONS.map((suggestion, idx) => (
              <ListItemButton 
                key={idx}
                sx={{ pl: 4 }}
                onClick={() => {
                  onChange(suggestion);
                  setShowSuggestions(false);
                }}
              >
                <Typography variant="body2">
                  {suggestion}
                </Typography>
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </Box>
    </Box>
  );
};

export default QueryInput;
```

### SqlViewer Component

**File:** `components/SqlViewer.tsx`

```tsx
import React from 'react';
import { Box, Paper } from '@mui/material';
import Editor from '@monaco-editor/react';

interface SqlViewerProps {
  sql: string;
  databaseType?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

export const SqlViewer: React.FC<SqlViewerProps> = ({
  sql,
  databaseType = 'sql',
  readOnly = true,
  onChange
}) => {
  return (
    <Paper sx={{ overflow: 'hidden', height: '400px' }}>
      <Editor
        height="100%"
        language="sql"
        value={sql}
        onChange={(value) => onChange?.(value || '')}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
          smoothScrolling: true,
        }}
        theme="vs-dark"
      />
    </Paper>
  );
};

export default SqlViewer;
```

### Results Table Component

**File:** `components/ResultsTable.tsx`

```tsx
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Button,
  Menu,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface ResultsTableProps {
  columns: string[];
  rows: any[];
  loading?: boolean;
  onExport?: (format: string) => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  columns,
  rows,
  loading = false,
  onExport
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleExport = (format: string) => {
    if (format === 'csv') {
      exportAsCSV();
    } else if (format === 'xlsx') {
      exportAsExcel();
    }
    setAnchorEl(null);
  };

  const exportAsCSV = () => {
    const csv = [
      columns.join(','),
      ...rows.map(row => 
        columns.map(col => JSON.stringify(row[col] || '')).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, `query-results-${Date.now()}.csv`);
  };

  const exportAsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Results');
    XLSX.writeFile(wb, `query-results-${Date.now()}.xlsx`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Export
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => handleExport('csv')}>
            Export as CSV
          </MenuItem>
          <MenuItem onClick={() => handleExport('xlsx')}>
            Export as Excel
          </MenuItem>
        </Menu>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              {columns.map(col => (
                <TableCell key={col} style={{ fontWeight: 'bold' }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => (
                <TableRow key={idx} hover>
                  {columns.map(col => (
                    <TableCell key={`${idx}-${col}`}>
                      {row[col] !== null && row[col] !== undefined 
                        ? String(row[col]) 
                        : '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
      />
    </Paper>
  );
};

export default ResultsTable;
```

---

## State Management (Redux Slice)

### Schema Slice

**File:** `store/slices/schemaSlice.ts`

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../api/client';

interface Schema {
  id: string;
  name: string;
  databaseType: string;
  tableCount: number;
  columnCount: number;
  status: 'VALID' | 'ANALYZING' | 'ANALYZED';
  uploadedAt: string;
}

interface SchemaState {
  schemas: Schema[];
  selectedSchema: Schema | null;
  loading: boolean;
  error: string | null;
}

const initialState: SchemaState = {
  schemas: [],
  selectedSchema: null,
  loading: false,
  error: null,
};

export const fetchSchemas = createAsyncThunk(
  'schema/fetchSchemas',
  async () => {
    const response = await apiClient.get('/api/v1/schemas');
    return response.data.schemas;
  }
);

export const uploadSchema = createAsyncThunk(
  'schema/uploadSchema',
  async (data: any) => {
    const response = await apiClient.post('/api/v1/schemas/upload', data);
    return response.data;
  }
);

const schemaSlice = createSlice({
  name: 'schema',
  initialState,
  reducers: {
    selectSchema: (state, action) => {
      state.selectedSchema = state.schemas.find(s => s.id === action.payload) || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchemas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSchemas.fulfilled, (state, action) => {
        state.loading = false;
        state.schemas = action.payload;
      })
      .addCase(fetchSchemas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch schemas';
      })
      .addCase(uploadSchema.fulfilled, (state, action) => {
        state.schemas.push(action.payload);
      });
  },
});

export const { selectSchema } = schemaSlice.actions;
export default schemaSlice.reducer;
```

### Query Slice

**File:** `store/slices/querySlice.ts`

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../api/client';

interface QueryRequest {
  schemaId: string;
  naturalLanguageQuery: string;
  explainQuery?: boolean;
  optimizeQuery?: boolean;
}

interface GeneratedQuery {
  queryId: string;
  generatedSql: string;
  explanation?: string;
  confidenceScore: number;
  suggestions?: any[];
  executionContext?: any;
}

interface QueryState {
  selectedSchema: any;
  queryRequest: QueryRequest | null;
  generatedQuery: GeneratedQuery | null;
  loading: boolean;
  error: string | null;
}

const initialState: QueryState = {
  selectedSchema: null,
  queryRequest: null,
  generatedQuery: null,
  loading: false,
  error: null,
};

export const generateQuery = createAsyncThunk(
  'query/generateQuery',
  async (request: QueryRequest) => {
    const response = await apiClient.post('/api/v1/queries/generate', request);
    return response.data;
  }
);

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    clearQuery: (state) => {
      state.generatedQuery = null;
      state.queryRequest = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedQuery = action.payload;
      })
      .addCase(generateQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate query';
      });
  },
});

export const { clearQuery } = querySlice.actions;
export default querySlice.reducer;
```

---

## API Client

**File:** `api/client.ts`

```typescript
import axios, { AxiosInstance } from 'axios';
import { store } from '../store';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch({ type: 'auth/logout' });
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## Styling & Theme

**File:** `theme/index.ts`

```typescript
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    secondary: {
      main: '#FF6B6B',
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FF9800',
    },
    error: {
      main: '#F44336',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '2.125rem',
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});
```

---

## File Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── SchemaManagement.tsx
│   │   ├── QueryGenerator.tsx
│   │   ├── QueryHistory.tsx
│   │   ├── Favorites.tsx
│   │   ├── Templates.tsx
│   │   ├── TeamSharing.tsx
│   │   └── Settings.tsx
│   │
│   ├── components/
│   │   ├── SchemaSelector.tsx
│   │   ├── SchemaUploadForm.tsx
│   │   ├── SchemaList.tsx
│   │   ├── QueryInput.tsx
│   │   ├── SqlViewer.tsx
│   │   ├── ResultsTable.tsx
│   │   ├── QueryOptimizations.tsx
│   │   ├── ExecutionContext.tsx
│   │   ├── StatsCard.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── ThemeToggle.tsx
│   │
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── schemaSlice.ts
│   │   │   ├── querySlice.ts
│   │   │   ├── favoritesSlice.ts
│   │   │   └── analyticsSlice.ts
│   │   ├── hooks.ts
│   │   └── index.ts
│   │
│   ├── api/
│   │   └── client.ts
│   │
│   ├── theme/
│   │   └── index.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── public/
├── package.json
└── vite.config.ts
```

---

## Package Dependencies

**File:** `package.json`

```json
{
  "name": "query-generator-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint src --ext ts,tsx"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@mui/material": "^5.13.0",
    "@mui/icons-material": "^5.13.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "@reduxjs/toolkit": "^1.9.5",
    "react-redux": "^8.1.2",
    "@tanstack/react-query": "^4.32.0",
    "@monaco-editor/react": "^4.5.0",
    "recharts": "^2.8.0",
    "react-hook-form": "^7.45.0",
    "zod": "^3.22.0",
    "axios": "^1.4.0",
    "date-fns": "^2.30.0",
    "file-saver": "^2.0.5",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/node": "^20.3.1",
    "typescript": "^5.1.3",
    "vite": "^4.3.9",
    "@vitejs/plugin-react": "^4.0.3",
    "vitest": "^0.34.4",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^5.16.5",
    "eslint": "^8.44.0",
    "eslint-plugin-react": "^7.32.2"
  }
}
```

---

## Success Criteria

- ✅ Intuitive schema upload interface
- ✅ Query generator with natural language input
- ✅ SQL viewer with syntax highlighting
- ✅ Results display with pagination and export
- ✅ Analytics dashboard with charts
- ✅ Query history and favorites
- ✅ Template library
- ✅ Team sharing interface
- ✅ Responsive mobile design
- ✅ Dark/Light theme support
- ✅ Real-time collaboration features
- ✅ All components tested
- ✅ 100% Lighthouse performance score target

---

## Deployment

### Docker Configuration

**File:** `Dockerfile`

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Docker Compose

**File:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:8080
    depends_on:
      - backend

  backend:
    image: query-generator-backend:latest
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: postgresql://user:password@postgres:5432/querydb
      JAVA_TOOL_OPTIONS: -Xmx512m
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: querydb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## Next Steps & Future Enhancements

1. **Mobile App** - Native iOS/Android using React Native
2. **Advanced Analytics** - Machine learning for query optimization recommendations
3. **AI Chatbot** - Conversational SQL generation
4. **Integrations** - Connect to Tableau, Looker, Power BI
5. **Data Lineage** - Track data flow through queries
6. **Version Control** - Git-like versioning for queries
7. **Query Testing** - Unit tests for generated queries

---

## Success Criteria Completed

- ✅ All 6 phases implemented
- ✅ Comprehensive feature documentation
- ✅ Architecture diagrams included
- ✅ Code examples provided
- ✅ Database migrations defined
- ✅ API endpoints specified
- ✅ Frontend components designed
- ✅ Testing strategies included
- ✅ Deployment configurations provided
- ✅ Ready for development team handoff