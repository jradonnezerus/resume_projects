import numpy as np
import pandas as pd

# Importing the credit card default data
# download the csv file in the same folder as the python file. Run programme in that directory
file_name = 'STI Main Dataset.csv'
df = pd.read_csv(file_name)
df_filtered = df.drop(columns = ['Date', 'STILag0'])

# separate the data into the features and classification
X = df_filtered.drop(columns = ['Up1Down0']).values
y = df_filtered['Up1Down0'].values

# train test split
train_X = X[:int(0.7*len(X)), :]
train_Y = y[:int(0.7*len(y))]
test_X = X[int(0.7*len(X)):, :]
test_Y = y[int(0.7*len(y)):]

# implement the naive bayesian
from sklearn.ensemble import RandomForestClassifier
no_of_rows = len(df_filtered)
print("There are", no_of_rows, "number of rows. We will use 70% of them as trainset.")

trainset_len = int(0.7*no_of_rows)
testset_len = no_of_rows - trainset_len
print("Hence,", trainset_len, "of rows will be used to train the model.")

model = RandomForestClassifier(n_estimators=25, max_depth=40 ,random_state=0)
model.fit(train_X, train_Y)

y_predicted = model.predict(train_X)
y_predicted2 = model.predict(test_X)

TP = 0
TN = 0
FP = 0
FN = 0

for i in range(len(y_predicted)):
    if y_predicted[i] == 1 and train_Y[i] == 1:
        TP += 1
    elif y_predicted[i] == 0 and train_Y[i] == 0:
        TN += 1
    elif y_predicted[i] == 1 and train_Y[i] == 0:
        FP += 1
    else:
        FN += 1
print(TP, TN, FP, FN)
print("Testset ==> Accuracy: %f, Precision: %f, Specificity: %f, Recall: %f, False Positive Rate: %f" % ((TP+TN)/(TP+TN+FP+FN), TP/(TP+FP), TN/(TN+FN), TP/(TP+FN), FP/(TN+FP)))

TP = 0
TN = 0
FP = 0
FN = 0

for i in range(len(y_predicted2)):
    if y_predicted2[i] == 1 and test_Y[i] == 1:
        TP += 1
    elif y_predicted2[i] == 0 and test_Y[i] == 0:
        TN += 1
    elif y_predicted2[i] == 1 and test_Y[i] == 0:
        FP += 1
    else:
        FN += 1
print(TP, TN, FP, FN)
print("Testset ==> Accuracy: %f, Precision: %f, Specificity: %f, Recall: %f, False Positive Rate: %f" % ((TP+TN)/(TP+TN+FP+FN), TP/(TP+FP), TN/(TN+FN), TP/(TP+FN), FP/(TN+FP)))