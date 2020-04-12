#### Text Mining ####

# Data Preparation
setwd("C:/Users/jrado/Desktop/Fake Thumbdrive/zzY3S1/BC2406 BA1/zzProject/Job_Candidates_Resumes")
library(quanteda)
library(readtext)
library(data.table)
library(ggplot2)

cv1 <- readtext("C:/Users/jrado/Desktop/Fake Thumbdrive/zzY3S1/BC2406 BA1/zzProject/Job_Candidates_Resumes/Sample Resume.pdf")

cv1.corpus <- corpus(cv1)
summary(cv1.corpus)

cv1.tokens <- tokens(cv1.corpus, remove_punct = T)
sum(ntoken(cv1.tokens))
cv1.tokens <- tokens_remove(cv1.tokens, pattern = stopwords('en'))
sum(ntoken(cv1.tokens))
cv1.tokens <- tokens_wordstem(cv1.tokens)
sum(ntoken(cv1.tokens))
cv1.tokens <- tokens_tolower(cv1.tokens)
sum(ntoken(cv1.tokens))
cv1.tokens

# CCA Analysis
CCA_dict <- dictionary(list(dance = c("hiphop", "danc*", "ballet", "funk*", "salsa", "waack*", "contemp*", "ballroom", "popp*", "lock*", "break*", "jazz", "lyrical", "house", "lindy", "swing"),
                            music = c("music*", "choir", "band", "symphon*", "chorale", "violin", "guitar", "emsemble", "orchestra", "string*", "harmonica", "percussion", "drums", "sing", "song"),
                            arts = c("art*", "theatre", "act*", "drama", "paint*", "creat*"),
                            volunteer = c("child*", "elderly", "cip", "deaf", "mute", "blind", "mental", "donat*", "volunteer", "nonprofit", "fundrais*"),
                            sports = c("sport*", "aikido", "archery", "badminton", "basketball", "bowling", "canoe", "polo", "climb*", "cricket", "fencing", "kayak", "floorball", "football", "soccer", "golf", "gymnast*", "hockey", "handball", "judo", "netball", "odac", "rugby", "sail*", "shoot*", "softball", "squash", "sumo", "swimming", "tennis", "taekwando", "tchoukball", "frisbee", "volleyball", "waterpolo", "wushu", "dragonboat"),
                            UG = c("uniform", "brigade", "guide", "scout", "brownie", "ncc", "cadet", "police", "army", "navy", "red cross", "sergeant", "officer", "ambulance", "st. john", "medic"),
                            leadership = c("president", "chair*", "*captain", "secretary", "vot*", "lead*", "head*", "treasur*", "vice*", "led", "spearhead*", "campaign*"),
                            academic_awards_achievements = c("certificate", "winner", "first", "second", "third", "gold", "silver", "bronze", "award*", "achiev*", "won", "represent*", "challenge*", "compet*", "dean*")))

cv1.lsd2 <- dfm(cv1.tokens, dictionary = CCA_dict)
cv1.lsd2.df <- convert(cv1.lsd2, to = "data.frame")
cv1.lsd2.df$totalscore <- sum(cv1.lsd2.df[2:9])
cv1.lsd2.df$document = substr(cv1.lsd2.df$document, start = 1, stop = nchar(cv1.lsd2.df$document)-20)
cv1.lsd2.df

# Graph Plot (CCA Analysis)
x <- as.data.table(transpose(cv1.lsd2.df[2:9]))
x <- x[, V0 := colnames(cv1.lsd2)]
x <- x[,V1,V0]

ggplot(x, aes(x = V0, y = V1, fill = V1)) + geom_bar(stat = "identity") + theme_minimal() + xlab("CCA") + ylab("Count") + scale_fill_gradient(low = "darkblue", high = "yellow")

# Word Cloud
cv1.recent.dfm <- dfm(cv1.corpus, remove = stopwords('en'), remove_punct = TRUE, remove_numbers = T)
set.seed(2014)
textplot_wordcloud(cv1.recent.dfm, max_words = 100)

### Text Mining on Different Set

cv1 <- readtext("C:/Users/jrado/Desktop/Fake Thumbdrive/zzY3S1/BC2406 BA1/zzProject/Job_Candidates_Resumes/Job Candidates' Resumes/*.pdf",
                docvarsfrom = "filenames",
                docvarnames = c("Applicant", "Number"),
                dvsep = "-",
                encoding = "UTF-8")

cv1.corpus <- corpus(cv1)
summary(cv1.corpus)

cv1.tokens <- tokens(cv1.corpus, remove_punct = T)
cv1.tokens <- tokens_remove(cv1.tokens, pattern = stopwords('en'))
cv1.tokens <- tokens_wordstem(cv1.tokens)
cv1.tokens <- tokens_tolower(cv1.tokens)
cv1.tokens

cv1.lsd2 <- dfm(cv1.tokens, dictionary = CCA_dict)
cv1.lsd2.df <- convert(cv1.lsd2, to = "data.frame")
cv1.lsd2.df$totalscore <- sum(cv1.lsd2.df[2:9])
cv1.lsd2.df$totalscore <- cv1.lsd2.df$dance + cv1.lsd2.df$music + cv1.lsd2.df$arts + cv1.lsd2.df$volunteer + cv1.lsd2.df$sports + cv1.lsd2.df$UG + cv1.lsd2.df$leadership + cv1.lsd2.df$academic_awards_achievements
cv1.lsd2.df
cv1.lsd2.df[order(-cv1.lsd2.df$totalscore),]



#### IBM HR Dataset ####

### Data Preparation

setwd("C:/Users/jrado/Desktop/Fake Thumbdrive/zzY3S1/BC2406 BA1/zzProject")
library(data.table)
hr.dt <- fread("IBM HR Data.csv", stringsAsFactors = T, na.strings = "")
str(hr.dt)

# To rename column names, so it is easier to work with
setnames(hr.dt, "Employee Source", "EmployeeSource")
setnames(hr.dt, "Application ID", "ApplicationID")

hr.dt[duplicated(hr.dt) == TRUE] # 14 rows are duplicated. Cannot use ApplicationID to find duplicates, as some rows' ApplicationID are NA, so will be seen as duplicates
hr.dt <- hr.dt[!duplicated(hr.dt) == T] #Keep rows with distinct ApplicationID


### General Data Discovery / Data Cleaning
summary(hr.dt$Age)
table(hr.dt$Age)

summary(hr.dt$Attrition)
hr.dt$Attrition <- factor(hr.dt$Attrition,
                          levels = c("Current employee", "Voluntary Resignation", "Termination"),
                          labels = c("Current employee", "Voluntary Resignation", "Termination"))

summary(hr.dt$BusinessTravel)
hr.dt$BusinessTravel <- factor(hr.dt$BusinessTravel,
                               levels = c("Non-Travel", "Travel_Rarely", "Travel_Frequently"),
                               labels = c("Non-Travel", "Travel_Rarely", "Travel_Frequently"))

summary(hr.dt$DailyRate)
table(hr.dt$DailyRate)

summary(hr.dt$Department) # there is a row with its Department value of 1296. Doesn't make sense. To investigate further.
hr.dt[Department == '1296'] # many fields in this row have weird values. Seems like the data from DailyRate onwards was shifted to the right.
hr.dt <- hr.dt[Department != '1296' | is.na(Department)] # remove that weird row. Easier and still have a lot of data left.

hr.dt$DistanceFromHome <- as.integer(levels(hr.dt$DistanceFromHome))[hr.dt$DistanceFromHome]
table(hr.dt$DistanceFromHome)
summary(hr.dt$DistanceFromHome)

summary(hr.dt$Education)
table(hr.dt$Education)
hr.dt$Education <- factor(hr.dt$Education)
summary(hr.dt$Education)

summary(hr.dt$EducationField)
hr.dt$EducationField <- factor(hr.dt$EducationField,
                               levels = c("Human Resources", "Life Sciences", "Marketing", "Medical", "Other", "Technical Degree"),
                               labels = c("Human Resources", "Life Sciences", "Marketing", "Medical", "Other", "Technical Degree"))

summary(hr.dt$EmployeeCount)
hr.dt[, EmployeeCount := NULL] # delete since all is 1

summary(hr.dt$EmployeeNumber)
hr.dt[, EmployeeNumber := NULL]

summary(hr.dt$ApplicationID)
hr.dt[, ApplicationID:= NULL] # because no real need for it

summary(hr.dt$EnvironmentSatisfaction)
table(hr.dt$EnvironmentSatisfaction) # One row has EnvironmentSatisfaction of 129588. To investigate further.
hr.dt[EnvironmentSatisfaction == '129588'] #many fields have weird values
hr.dt <- hr.dt[EnvironmentSatisfaction != '129588'| is.na(EnvironmentSatisfaction)] #remove this row
hr.dt$EnvironmentSatisfaction <- factor(hr.dt$EnvironmentSatisfaction)

summary(hr.dt$Gender)
hr.dt$Gender <- factor(hr.dt$Gender,
                       levels = c("Female", "Male"),
                       labels = c("Female", "Male"))

hr.dt$HourlyRate <- as.integer(levels(hr.dt$HourlyRate))[hr.dt$HourlyRate]
table(hr.dt$HourlyRate)
summary(hr.dt$HourlyRate)

hr.dt$JobInvolvement <- as.factor(hr.dt$JobInvolvement)
summary(hr.dt$JobInvolvement)

hr.dt$JobLevel <- as.factor(hr.dt$JobLevel)
summary(hr.dt$JobLevel)

summary(hr.dt$JobRole)
hr.dt$JobRole <- factor(hr.dt$JobRole,
                        levels = c("Healthcare Representative", "Human Resources", "Laboratory Technician", "Manager", "Manufacturing Director", "Research Director", "Research Scientist", "Sales Executive", "Sales Representative"),
                        labels = c("Healthcare Representative", "Human Resources", "Laboratory Technician", "Manager", "Manufacturing Director", "Research Director", "Research Scientist", "Sales Executive", "Sales Representative"))

summary(hr.dt$JobSatisfaction)
hr.dt$JobSatisfaction <- factor(hr.dt$JobSatisfaction,
                                levels = c("1", "2", "3", "4"),
                                labels = c("1", "2", "3", "4"))

summary(hr.dt$MaritalStatus)
hr.dt$MaritalStatus <- factor(hr.dt$MaritalStatus,
                              levels = c("Single", "Married", "Divorced"),
                              labels = c("Single", "Married", "Divorced"))

hr.dt$MonthlyIncome <- as.integer(levels(hr.dt$MonthlyIncome))[hr.dt$MonthlyIncome]
summary(hr.dt$MonthlyIncome)

table(hr.dt$NumCompaniesWorked)
summary(hr.dt$NumCompaniesWorked)

summary(hr.dt$Over18)
hr.dt[, Over18 := NULL] # delete since all is 18

summary(hr.dt$OverTime)
hr.dt$OverTime <- factor(hr.dt$OverTime,
                         levels = c("No", "Yes"),
                         labels = c("No", "Yes"))

summary(hr.dt$PercentSalaryHike)
hr.dt$PercentSalaryHike <- as.integer(levels(hr.dt$PercentSalaryHike))[hr.dt$PercentSalaryHike]

hr.dt$PerformanceRating <- factor(hr.dt$PerformanceRating,
                                  levels = c("3", "4"),
                                  labels = c("3", "4"))
summary(hr.dt$PerformanceRating)

summary(hr.dt$RelationshipSatisfaction)
table(hr.dt$RelationshipSatisfaction)
hr.dt$RelationshipSatisfaction <- factor(hr.dt$RelationshipSatisfaction)

table(hr.dt$StandardHours)
hr.dt[, StandardHours := NULL] # delete since all is 80 hours

table(hr.dt$StockOptionLevel)
hr.dt$StockOptionLevel <- factor(hr.dt$StockOptionLevel,
                                 levels = c("0", "1", "2", "3"),
                                 labels = c("0", "1", "2", "3"))

table(hr.dt$TotalWorkingYears)
summary(hr.dt$TotalWorkingYears)

table(hr.dt$TrainingTimesLastYear)
summary(hr.dt$TrainingTimesLastYear)

table(hr.dt$WorkLifeBalance)
hr.dt$WorkLifeBalance <- as.factor(hr.dt$WorkLifeBalance)

table(hr.dt$YearsAtCompany)
summary(hr.dt$YearsAtCompany)

table(hr.dt$YearsInCurrentRole)
summary(hr.dt$YearsInCurrentRole)

table(hr.dt$YearsSinceLastPromotion)
summary(hr.dt$YearsSinceLastPromotion)

table(hr.dt$YearsWithCurrManager)
summary(hr.dt$YearsWithCurrManager)

summary(hr.dt$EmployeeSource)
hr.dt[EmployeeSource == "Test", EmployeeSource := NA]
hr.dt[EmployeeSource == "Adzuna" | EmployeeSource == "GlassDoor" | EmployeeSource == "Indeed" | EmployeeSource == "Jora" | EmployeeSource == "LinkedIn" | EmployeeSource == "Recruit.net" | EmployeeSource == "Seek", EmployeeSource := "Job Portal"]
hr.dt$EmployeeSource <- factor(hr.dt$EmployeeSource,
                               levels = c("Company Website", "Job Portal", "Referral"),
                               labels = c("Company Website", "Job Portal", "Referral"))
summary(hr.dt$EmployeeSource)

hr.dt$TotalYearsBeforeJoining <- hr.dt$TotalWorkingYears - hr.dt$YearsAtCompany # their job experience level


### Data Cleaning Logical Errors

hr.dt[YearsAtCompany > TotalWorkingYears] # 6 rows, which should not be possible
hr.dt[YearsAtCompany > TotalWorkingYears, `:=`(YearsAtCompany = NA, TotalWorkingYears = NA)]

hr.dt[YearsInCurrentRole > TotalWorkingYears] # zero rows
hr.dt[YearsInCurrentRole > YearsAtCompany] # zero rows
hr.dt[YearsWithCurrManager > YearsAtCompany] # zero rows

hr.dt[, AgeJoined := Age - YearsAtCompany]
hr.dt[AgeJoined < 14] # taking legal age to work is 14 years old
hr.dt[AgeJoined < 14, `:=`(Age = NA, YearsAtCompany = NA, AgeJoined = NA)]

hr.dt[TotalWorkingYears > Age]
hr.dt[TotalWorkingYears > Age, `:=`(Age = NA, TotalWorkingYears = NA)]

hr.dt[YearsAtCompany > Age] # zero rows
hr.dt[YearsInCurrentRole > Age] # zero rows


### Years at Company
library(rpart)
library(rpart.plot)

set.seed(2014)
options(digits = 3)
options(scipen = 999)

hr1.dt <- hr.dt[Attrition == "Voluntary Resignation"]
cart1 <- rpart(YearsAtCompany ~ AgeJoined+DistanceFromHome+Education+EducationField+Gender+NumCompaniesWorked+TotalYearsBeforeJoining+EmployeeSource, data = hr1.dt, method = 'anova', cp = 0) # find maximal tree
rpart.plot(cart1, nn = T, main = "Maximal Tree")
print(cart1)
printcp(cart1, digits = 7)
plotcp(cart1)

CVerror.cap <- cart1$cptable[which.min(cart1$cptable[,"xerror"]), "xerror"] + cart1$cptable[which.min(cart1$cptable[,"xerror"]), "xstd"] 
# Find the optimal CP region whose CV error is just below CVerror.cap in maximal tree cart1. 
i <- 1; j<- 4 
while (cart1$cptable[i,j] > CVerror.cap) { i <- i + 1 } 
# Get geometric mean of the two identified CP values in the optimal region if optimal tree has at least one split. 
cp.opt = ifelse(i > 1, sqrt(cart1$cptable[i,1] * cart1$cptable[i-1,1]), 1)

# prune to see the optimal tree
set.seed(2014)
cart2 <- prune(cart1, cp = cp.opt)
rpart.plot(cart2, nn = T)
print(cart2)
printcp(cart2, digits = 7)
# MSE of trainset predictions = root node error * rel.error 
MSE.train <- 27.34283 * 0.1458785
RMSE.train <- sqrt(MSE.train)
# MSE of testset predictions = root node error * xerror
MSE.test <- 27.34283 * 0.2440209
RMSE.test <- sqrt(MSE.test)
# RMSE of testset is 2.58 while the RMSE of trainset is 2.00
# Since RMSE of testset is not much greater than RMSE of trainset, we can conclude that the model is not too complex.
cart2$variable.importance
summary(cart2)

# Optimal tree is too big to analyse the decision rules one by one, thus we artificially pruned the tree further to see the top few decision rules.
cp.opt1 <- 0.019
# Prune to see the top few splits
cart3 <- prune(cart1, cp = cp.opt1)
rpart.plot(cart3, nn = T, tweak = 1.3)
print(cart3)
printcp(cart3, digits = 3)

### Job Satisfaction
library(nnet)

m4 <- multinom(JobSatisfaction ~ AgeJoined+DistanceFromHome+Education+EducationField+Gender+NumCompaniesWorked+TotalYearsBeforeJoining+EmployeeSource,  data = hr.dt)
summary(m4)

z <- summary(m4)$coefficients/summary(m4)$standard.errors 
pvalue <- (1 - pnorm(abs(z), 0, 1))*2 # 2-tailed test p-values 
pvalue

OR <- exp(coef(m4)) 
OR

OR.CI <- exp(confint(m4))
OR.CI

m5 <- multinom(JobSatisfaction~ Education+TotalYearsBeforeJoining+EmployeeSource , data = hr.dt) 
summary(m5)

OR <- exp(coef(m5))
OR

OR.CI <- exp(confint(m5))
OR.CI


### Performance Rating (make for CART and logistic model)
# we ran the model previously without subsetting, and because there are 19859 observations for "3" and 3647 observations for "4"
# the CART model below could not be built. Hence, we sampled an equal number of rows for both "3" and "4".

set.seed(2014)
table(hr.dt$PerformanceRating)
hr.dt[PerformanceRating == 3]

hr.dt$ID <- seq.int(nrow(hr.dt))
RNGlist <- sample(hr.dt[PerformanceRating == 3, ID], 3647, replace = F)
pr3 <- hr.dt[ID %in% RNGlist]
pr4 <- hr.dt[PerformanceRating == 4]
hr2.dt <- merge(pr3, pr4, all = T)
summary(hr2.dt$PerformanceRating)

hr.dt <- hr.dt[, ID := NULL]
hr2.dt <- hr2.dt[, ID := NULL]

options(scipen = 999)
set.seed(2014)
# only include X-variables that exist before person joins the company
cart4 <- rpart(PerformanceRating ~ AgeJoined+DistanceFromHome+Education+EducationField+Gender+NumCompaniesWorked+TotalYearsBeforeJoining+EmployeeSource, data = hr2.dt, method = 'class', cp = 0) # find maximal tree
rpart.plot(cart4, nn = T, main = "Maximal Tree")
print(cart4)
printcp(cart4, digits = 7) # min CV error at tree 44: ceiling will be 0.7817384+0.01142663 = 0.793165. simplest tree below ceiling is tree 37. set cp = sqrt(0.00027419797 * 0.00032903757) = 0.0003003688
plotcp(cart4)
cp.opt <- 0.0003003688

#prune to see the optimal tree
cart5 <- prune(cart4, cp = cp.opt)
rpart.plot(cart5, nn = T)
print(cart5)
printcp(cart5, digits = 7)
cart5$variable.importance
summary(cart5)

predicted <- predict(cart5, newdata = hr2.dt, type = 'class')
table(hr2.dt$PerformanceRating, predicted)
# trainset accuracy = 74.9%; cross-validation accuracy = 60.7%

# just for visualisation
cart5 <- prune(cart4, cp = 0.0085001371) # change
rpart.plot(m3, nn = T)


#### TURNOVER DATASET ####
ocean.dt <- fread("turnover.csv", stringsAsFactors = T, na.strings = "")

### Data Cleaning
# Rename column headers
colnames(ocean.dt)[colnames(ocean.dt) == "stag"] <- "MonthsAtCompany"
colnames(ocean.dt)[colnames(ocean.dt) == "extraversion"] <- "Extraversion"
colnames(ocean.dt)[colnames(ocean.dt) == "independ"] <- "Agreeableness"
colnames(ocean.dt)[colnames(ocean.dt) == "selfcontrol"] <- "Conscientiousness"
colnames(ocean.dt)[colnames(ocean.dt) == "anxiety"] <- "Neuroticism"
colnames(ocean.dt)[colnames(ocean.dt) == "novator"] <- "OpennessToExperience"
# Transform MonthsAtCompany to YearsAtCompany
ocean.dt$YearsAtCompany <- ocean.dt$MonthsAtCompany / 12
# Get variable AgeJoined
ocean.dt$AgeJoined <- ocean.dt$age - ocean.dt$YearsAtCompany
# Use data only where employee has left the company
ocean1.dt <- ocean.dt[event == 1]

### Years At Company
m1 <- lm(YearsAtCompany ~ gender+AgeJoined+Extraversion+Agreeableness+Conscientiousness+Neuroticism+OpennessToExperience, data = ocean1.dt)
summary(m1) #AgeJoined, Conscientiousness and OpennessToExperience are significant variables in predicting YearsAtCompany.
m2 <- lm(YearsAtCompany ~ AgeJoined+Conscientiousness+OpennessToExperience, data = ocean1.dt) #retain only significant variables
summary(m2)

# Variance Inflation Error (VIF)
library(car)
vif(m1) # VIF values for each variable is less than 5
vif(m2) # VIF values for the remaining variables decreased
# Although there is no multicollinearity problem, the model was improved by removing the less significant factors

# 70/30 Train-Test Split
library(caTools)
set.seed(2014)

train <- sample.split(Y = ocean1.dt$YearsAtCompany, SplitRatio = 0.7) 
trainset <- subset(ocean1.dt, train == T) 
testset <- subset(ocean1.dt, train == F)

summary(trainset$YearsAtCompany)
summary(testset$YearsAtCompany)

m3 <- lm(YearsAtCompany ~ AgeJoined + Conscientiousness + OpennessToExperience, data = trainset) 
summary(m3)

residuals(m3)

RMSE.m3.train <- sqrt(mean(residuals(m3)^2))

summary(abs(residuals(m3)))

predict.m3.test <- predict(m3, newdata = testset) 
testset.error <- testset$YearsAtCompany - predict.m3.test

RMSE.m3.test <- sqrt(mean(testset.error^2)) 
summary(abs(testset.error))

# RSME of train set = 2.38, RSME of test set = 2.18
# Since RSME of test set is smaller than that of train set, we can conclude that the model is not too complex.
