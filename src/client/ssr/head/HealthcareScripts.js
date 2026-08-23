SrrComponent = ({ ssrPath }) => html`
  <script type="text/javascript" src="${ssrPath}dist/validator/validator.min.js"></script>
  <script type="text/javascript" src="${ssrPath}dist/ag-grid-community/ag-grid-community.min.js"></script>
  <script type="text/javascript" src="${ssrPath}dist/d3/d3.min.js"></script>
  <script type="text/javascript" src="${ssrPath}dist/peerjs/peerjs.min.js"></script>
  <script type="text/javascript" src="${ssrPath}dist/rrule/rrule.min.js"></script>
  <script type="text/javascript" src="${ssrPath}dist/fullcalendar/global.js"></script>
  <script type="text/javascript" src="${ssrPath}dist/@fullcalendar/rrule/global.js"></script>
  <script type="text/javascript" src="${ssrPath}dist/easymde/easymde.min.js"></script>
  <link rel="stylesheet" href="${ssrPath}dist/easymde/easymde.min.css" />
`;
