ui <- fluidPage(
  titlePanel("Uploading Files"),
  sidebarLayout(
    sidebarPanel(
      fileInput("file1", "Choose CSV File",
                multiple = TRUE,
                accept = c("text/csv",
                           "text/comma-separated-values,text/plain",
                           ".csv")),
      checkboxInput("header", "Header", TRUE),
      radioButtons("disp", "Display",
                   choices = c(Head = "head",
                               All = "all"),
                   selected = "head"),
      tags$hr(),
      selectInput("dept", "Department",
                   choices = c(Sales = "Sales",
                               Finance = "Finance",
                               CFO = "CFO")),
      dateRangeInput("dates", "Date Range"),
      conditionalPanel(
        condition = "input.dept == 'Sales'", textInput("salescode", "Sales Person Code", value="Enter Sales Person ID:")
      )
      ,
      checkboxGroupInput("projectcode", "Project Code(s)", choices = "")
    ),
    
    mainPanel(
      conditionalPanel(
        condition = "input.dept == 'CFO'", tableOutput("contentsCFO")),
      conditionalPanel(
        condition = "input.dept == 'Finance'", tableOutput("contentsFinance")),
      conditionalPanel(
        condition = "input.dept == 'Sales'", tableOutput("contentsSales"))
      )
  )
)
##############################
library(shiny)
library(data.table)
server <- function(input, output, session) {
  
  data <- reactive({
    req(input$file1)
    fread(input$file1$datapath,
                header = input$header,
                sep = ",",
                quote = '"')})
  
  observe({
    req(input$file1)
    cb_options <- list()
    dsnames <- t(data()[as.Date(as.character(DocDate), format="%Y%m%d") >= input$dates[1] & as.Date(as.character(DocDate), format="%Y%m%d") <= input$dates[2],.(sort(unique(`ProjectCode`)))])
    cb_options[dsnames] <- dsnames
    updateCheckboxGroupInput(session, "projectcode",
                             label = "Project Code(s)",
                             choices = cb_options,
                             selected = "")})
  
  output$contentsCFO <- renderTable(
    if(input$disp == "head") {return(head(data()[as.Date(as.character(DocDate), format="%Y%m%d") >= input$dates[1] & as.Date(as.character(DocDate), format="%Y%m%d") <= input$dates[2] & ProjectCode %in% input$projectcode]))}
    else {return(data()[as.Date(as.character(DocDate), format="%Y%m%d") >= input$dates[1] & as.Date(as.character(DocDate), format="%Y%m%d") <= input$dates[2] & ProjectCode %in% input$projectcode])}
  )
  
  output$contentsFinance <- renderTable(
    if(input$disp == "head") {return(head(data()[as.Date(as.character(DocDate), format="%Y%m%d") >= input$dates[1] & as.Date(as.character(DocDate), format="%Y%m%d") <= input$dates[2] & ProjectCode %in% input$projectcode,.(DocDate, DocRef, AcCrIsMinus1, AcCode, AcCur, AcCurWTaxAmt, HomeWTaxAmt, ProjectCode, `Sales Person`, `Sales contact`)]))}
    else {return(data()[as.Date(as.character(DocDate), format="%Y%m%d") >= input$dates[1] & as.Date(as.character(DocDate), format="%Y%m%d") <= input$dates[2] & ProjectCode %in% input$projectcode,.(DocDate, DocRef, AcCrIsMinus1, AcCode, AcCur, AcCurWTaxAmt, HomeWTaxAmt, ProjectCode, `Sales Person`, `Sales contact`)])}
  )
  
  output$contentsSales <- renderTable(
    if(input$disp == "head") {return(head(data()[as.Date(as.character(DocDate), format="%Y%m%d") >= input$dates[1] & as.Date(as.character(DocDate), format="%Y%m%d") <= input$dates[2] & `Sales Person` == input$salescode & ProjectCode %in% input$projectcode,.(DocDate, DocRef, `Customer Name`, `Postal Code`, TelNo, HomeWTaxAmt, ProjectCode, Location)]))}
    else {return(data()[as.Date(as.character(DocDate), format="%Y%m%d") >= input$dates[1] & as.Date(as.character(DocDate), format="%Y%m%d") <= input$dates[2] & `Sales Person` == input$salescode & ProjectCode %in% input$projectcode,.(DocDate, DocRef, `Customer Name`, `Postal Code`, TelNo, HomeWTaxAmt, ProjectCode, Location)])}
  )
}

shinyApp(ui, server)