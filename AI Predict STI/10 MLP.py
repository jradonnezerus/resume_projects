from keras.models import Sequential
from keras.layers import Dense
import numpy as np
import pandas as pd

from keras.optimizers import Adam

# fix random seed for reproducibility
np.random.seed(2020)

dataset = pd.read_csv("STI Main Dataset.csv")
# split into input (X) and output (Y) variables
X = dataset.iloc[:, 2:16].values.reshape(-1, 14)
y = dataset.iloc[:, 16].values.reshape(-1, 1)

# train test split
train_X = X[:int(0.7*len(X)), :]
train_Y = y[:int(0.7*len(y))]
test_X = X[int(0.7*len(X)):, :]
test_Y = y[int(0.7*len(y)):]

# create model
model = Sequential()
model.add(Dense(10, input_dim=X.shape[1], activation='tanh'))
model.add(Dense(8, activation='tanh'))
#model.add(Dense(5, activation='tanh'))
model.add(Dense(6, activation='tanh'))
model.add(Dense(1, activation='sigmoid'))

# Compile model
model.compile(loss='binary_crossentropy', optimizer= Adam(lr = 0.0001), metrics=['accuracy'])

# Fit the model
model.fit(train_X, train_Y, epochs=25, batch_size=1) #25

# predict
r = model.predict(train_X)
print(sum(r == 1), sum(r == 0)) # this shows that 2065 1s and 0 0s... the model is just predicting 1 all the way. This is despite the fact that the dataset has roughly similar numbers of 0s and 1s (fairly represented).

# evaluate the model
scores = model.evaluate(train_X, train_Y)
print("Keras: \n%s: %.2f%%" % (model.metrics_names[1], scores[1]*100))  # maximum seems to be 50.61%

predictions = model.predict(train_X)
predictions = predictions.reshape(-1, 1).tolist()

TP = 0
TN = 0
FP = 0
FN = 0

for i in range(len(predictions)):
    if predictions[i][0] >= 0.5 and train_Y[[i][0]] == 1:
        TP += 1
    elif predictions[i][0] < 0.5 and train_Y[[i][0]] == 0:
        TN += 1
    elif predictions[i][0] >= 0.5 and train_Y[[i][0]] == 0:
        FP += 1
    else:
        FN += 1
print(TP, TN, FP, FN)
print("Trainset ==> Accuracy: %f, Precision: %f, Specificity: %f, Recall: %f, False Positive Rate: %f" % ((TP+TN)/(TP+TN+FP+FN), TP/(TP+FP), TN/(TN+FN), TP/(TP+FN), FP/(TN+FP)))

predictions2 = model.predict(test_X)
predictions2 = predictions2.reshape(-1, 1).tolist()

TP = 0
TN = 0
FP = 0
FN = 0

for i in range(len(predictions2)):
    if predictions2[i][0] >= 0.5 and test_Y[[i][0]] == 1:
        TP += 1
    elif predictions2[i][0] < 0.5 and test_Y[[i][0]] == 0:
        TN += 1
    elif predictions2[i][0] >= 0.5 and test_Y[[i][0]] == 0:
        FP += 1
    else:
        FN += 1
print(TP, TN, FP, FN)
print("Testset ==> Accuracy: %f, Precision: %f, Specificity: %f, Recall: %f, False Positive Rate: %f" % ((TP+TN)/(TP+TN+FP+FN), TP/(TP+FP), TN/(TN+FN), TP/(TP+FN), FP/(TN+FP)))

# https://datascience.stackexchange.com/questions/5706/what-is-the-dying-relu-problem-in-neural-networks
# https://stackoverflow.com/questions/41488279/neural-network-always-predicts-the-same-class