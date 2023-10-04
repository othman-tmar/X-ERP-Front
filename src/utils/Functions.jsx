import html2pdf from "html2pdf.js";

export  const formatDate =(dateInput) => {
    let date = new Date(dateInput);
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear().toString().substr(-2);
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }


  export const parseDate = (dateString) => {
    let [datePart, timePart] = dateString.split(' ');
    let [day, month, year] = datePart.split('/');
    let [hours, minutes] = timePart.split(':');

    // JavaScript's Date constructor expects the year, month, and day as full numbers.
    // Also, the month is 0-indexed (January is 0, December is 11), so we subtract 1 from the month.
    return new Date(`20${year}`, month - 1, day, hours, minutes);
}



export const printDate = (doc) => {
  // Get current date
  const dateNow = moment().format('DD/MM/YY HH:mm');
  
  // Get page width
  const pageWidth = doc.internal.pageSize.getWidth();

  // Set a small margin
  const margin = 10;

  // Set font size
  doc.setFontSize(8); // Adjust this value to change the font size

  // Calculate x position for right alignment
  const x = pageWidth - doc.getTextWidth(` Maintenance department / Print Date: ${dateNow}`) - margin;

  return doc.text(`Maintenance department / Print Date: ${dateNow}`, x, margin);
}


const moment = require('moment');

export const getDifference = (date1, date2) => {
  const momentDate1 = moment(date1, 'DD/MM/YY HH:mm');
  const momentDate2 = moment(date2, 'DD/MM/YY HH:mm');

  // Calculate the difference in milliseconds
  const diff = momentDate2.diff(momentDate1);

  // Convert the difference to a human-readable format
  const duration = moment.duration(diff);

  // Create an array to hold the time units
  let timeUnits = [];

  // Calculate total number of days
  const totalDays = Math.floor(duration.asDays());

  if (totalDays !== 0) {
    timeUnits.push(`${totalDays} days`);
  }
  
  if (duration.hours() !== 0) {
    timeUnits.push(`${duration.hours()} hours`);
  }
  
  if (duration.minutes() !== 0) {
    timeUnits.push(`${duration.minutes()} minutes`);
  }

  return `${timeUnits.join(', ')}`;
}


export const printDocument = (element) => {
  // Get current date
  const dateNow = moment().format("DD/MM/YY HH:mm");

  // Create a new div at the top of 'divToPrint' with the date and "Maintenance department"
 /*  let element = document.getElementById(id); */
  let newDiv = document.createElement("div");
  newDiv.innerHTML = `<div style="position: absolute ; top: 0px; right: 0px;" className:"border">Maintenance department / Print Date: ${dateNow}</div>`;
  element.prepend(newDiv); // Insert 'newDiv' into 'divToPrint'

  let opt = {
    margin: 1,
    filename: "myfile.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: [210, 297], orientation: "portrait" },
  };

  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      // Remove the new div after saving the PDF
      element.removeChild(newDiv);
    });
};
export const printChart = (element1, element2) => {
  // Get current date
  const dateNow = moment().format("DD/MM/YY HH:mm");

  // Create a new div at the top of 'divToPrint' with the date and "Maintenance department"
  let newDiv = document.createElement("div");
  newDiv.innerHTML = `<div style="position: absolute; color: black; top: 0px; right: 0px;" >Maintenance department / Print Date: ${dateNow}</div>`;
  element1.prepend(newDiv); // Insert 'newDiv' into 'divToPrint'
  
  // Change the style of 'element2'
  element2.style.color = "black";

  // Append 'element2' to 'element1'
  element1.appendChild(element2);

  let opt = {
    margin: 1,
    filename: "myfile.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: [210, 310], orientation: "landscape" },
  };
  
  html2pdf()
    .set(opt)
    .from(element1)
    .save()
    .then(() => {
      // Remove the new div after saving the PDF
      element1.removeChild(newDiv);
      
      // Reset the style of 'element2'
      element2.style.color = "";
    });  
};
export const getTimeDifference = (createdAt) => {
  const createdAtDate = new Date(createdAt);
  const now = new Date();
  let timeDiff = now.getTime() - createdAtDate.getTime();

  const weeks = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
  timeDiff -= weeks * (1000 * 60 * 60 * 24 * 7);

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  timeDiff -= days * (1000 * 60 * 60 * 24);

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  timeDiff -= hours * (1000 * 60 * 60);

  const minutes = Math.round(timeDiff / (1000 * 60));

  if (weeks > 0) {
    return `${weeks}w`;
  } else if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
};