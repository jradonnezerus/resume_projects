### XGBoost

library(xgboost)

library(data.table)
setwd("C:/Users/jrado/Desktop/Fake Thumbdrive/zzY3S2/BC3409 AI in Acct & Finance/zzPA")
dt <- fread("STI Main Dataset.csv")
dt[, Date := NULL]
dt[, STILag0 := NULL]

# Train-Test Split
set.seed(2020)

train_index <- sample(1:nrow(dt), 0.8 * nrow(dt))
test_index <- setdiff(1:nrow(dt), train_index)

#First 9 are datapoints, Last one is Diabetes or No Diabetes
X_train <- as.matrix(dt[train_index, -15])
y_train <- as.matrix(dt[train_index, 15])

X_test <- as.matrix(dt[test_index, -15])
y_test <- as.matrix(dt[test_index, 15])

dtrain <- xgb.DMatrix(data = X_train, label = y_train)
bst <- xgboost(data = dtrain, max.depth = 100, eta = 0.01, nthread = 2, nrounds = 500, objective = "binary:logistic", verbose = 2)

# Trainset Evaluation

pred0 <- predict(bst, X_train)
err0 <- mean(as.numeric(pred0 > 0.5) == y_train)
print(paste("trainset accuracy=", err0))

sum(as.numeric(pred0>0.5) == y_train) # total 1652 correct, of which:
sum(as.numeric(pred0>0.5) == y_train & y_train == 1) # 843 1s 
sum(as.numeric(pred0>0.5) == y_train & y_train == 0) # 809 0s
sum(as.numeric(pred0>0.5) != y_train & y_train == 1) # predict 0 but y 1 -> 0. 
sum(as.numeric(pred0>0.5) != y_train & y_train == 0) # predict 1 but y 0 -> 0.

# Testset Evaluation

pred <- predict(bst, X_test)
err <- mean(as.numeric(pred > 0.5) == y_test)

print(paste("testset accuracy=", err))

# extra
sum(as.numeric(pred>0.5) == y_test) # total 290 correct, of which:
sum(as.numeric(pred>0.5) == y_test & y_test == 1) # 147 1s 
sum(as.numeric(pred>0.5) == y_test & y_test == 0) # 143 0s
sum(as.numeric(pred>0.5) != y_test & y_test == 1) # predict 0 but y 1 -> 55. 
sum(as.numeric(pred>0.5) != y_test & y_test == 0) # predict 1 but y 0 -> 68

