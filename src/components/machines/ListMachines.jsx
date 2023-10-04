import React, { useState, useMemo } from "react";
import ReactLoading from "react-loading";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { MaterialReactTable } from "material-react-table";
import { delMachine } from "../../features/MachineSlice";
import EditMachine from "./EditMachine";
import DetailsMachine from "./DetailsMachine";
import { Button } from "@mui/material";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import jsPDF from "jspdf";
import {printDate} from "../../utils/Functions"
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const ListMachines = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
   const [showDetails, setShowDetails] = useState(false);
  const { machines, isLoading, error } = useSelector(
    (state) => state.storeMachines
  );

  const [selectedItem, setSelectedItem] = useState(null);
   const [selectedRow, setSelectedRow] = useState(null);

  const handleClose = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

     const handleCloseDetails = () => {
        setShowDetails(false);
        setSelectedRow(null);
      };

         const handleRowClick = (row) => { 
        setSelectedRow(row.original);
        setShowDetails(true);  
      };

  const handleDelete = (id, name) => {
    if (window.confirm("Confirm Deleting")) {
      dispatch(delMachine(id));
      toast(`Machine ${name} Deleted`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "image", //access nested data with dot notation
        header: "Image machine",
        Cell: ({ cell }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <img
              alt=""
              height={60}
              src={cell.getValue()}
              loading="lazy"
              style={{ borderRadius: "20%" }}
            />
          </Box>
        ),
      },

      {
        accessorKey: "referenceMachine", //access nested data with dot notation
        header: "Reference machine",
        size: 100,
      },
      {
        accessorKey: "nameMachine",
        header: "Name machine",
        size: 100,
      },
      {
        accessorKey: "departmentID.nameDepartment", //normal accessorKey
        header: "Department",
        size: 100,
      },
      {
        accessorKey: "productionTime",
        header: "Production Time",
        size: 100,
      },
      {
        accessorKey: "nbPreMainInWeek",
        header: "Preventive Main NB /week",
        size: 100,
      },
      {
        accessorKey: "_id",
        header: "actions",
        size: 100,
        Cell: ({ cell, row }) => (
          <div>
            <Button
              onClick={(event) =>{event.stopPropagation(); handleEdit(cell.row.original)}}
              size="md"
              className="text-warning btn-link edit"
            >
              <i class="fa-solid fa-pen-to-square"></i>
            </Button>
            <Button
              onClick={(event) => {
                event.stopPropagation();
                handleDelete(
                  cell.row.original._id,
                  cell.row.original.nameMachine
                );
              }}
              size="md"
              className="text-danger btn-link delete"
            >
              <i className="fa fa-trash" />
            </Button>
          </div>
        ),
      },
    ],
    [machines]
  );
  if (isLoading)
    return (
      <center>
        <ReactLoading
          type="spokes"
          color="green"
          height={"10%"}
          width={"10%"}
        />
      </center>
    );
  if (error) return <p>Cannot display machines list due to errors</p>;

  

  const handleExportData = () => {
    const doc = new jsPDF();
    const headers = columns.slice(0, -1).map((column) => column.header);
    const accessorKeys = columns
      .slice(0, -1)
      .map((column) => column.accessorKey);
    const data = machines.map((machine) =>
      accessorKeys.map((key) => {
        // Split the key into parts
        const parts = key.split(".");
        // Use reduce to navigate the nested objects
        return parts.reduce((obj, part) => obj && obj[part], machine);
      })
    );

    doc.autoTable({
      head: [headers],
      body: data,
      columnStyles: {
        0: { cellWidth: 30 }, // For the first column
        1: { cellWidth: 30 }, // For the second column
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
        // etc.
        // Add more as needed
      },
      styles: {
        minCellHeight: 2, // Reduce the height of all rows
        lineWidth: 0.1, // Set line width for all cells
        lineColor: [190, 190, 190], // Set line color for all cells
        halign: "center", // Align all text in the center
        valign: 'middle' // Align all text in the middle vertically
      }, 
      didDrawCell: function (data) {
        if (data.column.index === 0 && data.cell.section === "body") {
          var img = new Image();
          img.src = data.cell.raw; // Assuming data.cell.raw contains the image URL
          doc.addImage(
            img,
            "JPEG",
            data.cell.x+0.5 ,
            data.cell.y +0.5,
            data.cell.width + 3,
            data.cell.height - 0.5
          );
        }
      },
    });
    printDate(doc);
    doc.save("sample.pdf");
  };

  const handleExportSelectedRows = (selectedRows) => {
    const doc = new jsPDF();
    const headers = columns.slice(0, -1).map((column) => column.header); // Exclude the last column
    const accessorKeys = columns
      .slice(0, -1)
      .map((column) => column.accessorKey); // Exclude the last column
    const data = selectedRows.map((row) =>
      accessorKeys.map((key) => {
        // Split the key into parts
        const parts = key.split(".");
        // Use reduce to navigate the nested objects
        return parts.reduce((obj, part) => obj && obj[part], row.original);
      })
    );

    doc.autoTable({
      head: [headers],
      body: data,
      columnStyles: {
        0: { cellWidth: 30 }, // For the first column
        1: { cellWidth: 30 }, // For the second column
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
        // etc.
        // Add more as needed
      },
      styles: {
        minCellHeight: 2, // Reduce the height of all rows
        lineWidth: 0.1, // Set line width for all cells
        lineColor: [190, 190, 190], // Set line color for all cells
        halign: "center", // Align all text in the center
        valign: 'middle' // Align all text in the middle vertically
      }, 
      didDrawCell: function (data) {
        if (data.column.index === 0 && data.cell.section === "body") {
          var img = new Image();
          img.src = data.cell.raw; // Assuming data.cell.raw contains the image URL
          doc.addImage(
            img,
            "JPEG",
            data.cell.x+0.5 ,
            data.cell.y +0.5,
            data.cell.width + 3,
            data.cell.height - 0.5
          );
        }
      },
    });
    printDate(doc);
    doc.save("selected-rows.pdf");
  };
  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={machines}
        enableRowSelection
        muiTableBodyRowProps={({ row, rowIndex }) => ({
          onClick: (event) => {
            // Get the cell index from the event target
            const cellIndex = event.target.cellIndex;
        
            // Get the number of columns in the table
            const numColumns = columns.length;
        
            // Check if the clicked cell is not in the last column
            if (cellIndex !== numColumns - 1) {
              handleRowClick(row);
            }
          },
          sx: {
            cursor: 'pointer',
          },
        })}
        positionToolbarAlertBanner="bottom"
        renderTopToolbarCustomActions={({ table }) => (
          <Box
            sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}
          >
            <Button
              color="primary"
              //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
              onClick={handleExportData}
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export All Data
            </Button>
            <Button
              disabled={
                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
              }
              //only export selected rows
              onClick={() =>
                handleExportSelectedRows(table.getSelectedRowModel().rows)
              }
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export Selected Rows
            </Button>
          </Box>
        )}
      />

      {showModal && (
        <EditMachine
          show={showModal}
          handleClose={handleClose}
          machine={selectedItem}
        />
      )}
      {showDetails && <DetailsMachine showDetails={showDetails}
          handleCloseDetails={handleCloseDetails} machine={selectedRow} />}
    </>
  );
};
export default ListMachines;
