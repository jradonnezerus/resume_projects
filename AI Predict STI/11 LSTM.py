from keras.models import Sequential
from keras.layers import Dense, LSTM, Dropout
from sklearn.model_selection import train_test_split
import pandas as pd

timesteps = 35  # take in 4 sequence, higher the more accurate
data_size = 2065 # datasize selected must have both attack and normal data. Because timesteps = 4, means 24 boxes.
data_resize = int(data_size/timesteps) #data_size/timesteps
num_classes = timesteps #follow timestep
data_dim = 14
batchsize = 1 # number of data in a batch. 1 means that every 4 rows (timesteps). Epoch means = go in and backpropagate = 1 epoch = 1 batch. 100 means do this going forward and back 100 times with the same data. Batchsize means the number of epochs before you change the weight. Smaller more accurate, but if you have 1billion data, you may need to increase it so faster.
epoch_no = 100
drop = 0.2

# load dataset
dataset = pd.read_csv("STI Main Dataset.csv")
x_data = dataset.iloc[:,2:16].values
y_data = dataset.iloc[:,16].values

# split into input (X) and output (Y) variables
X = x_data[:data_size,0:data_dim]
Y = y_data[:data_size]

# required format for lstm
X_shaped = X.reshape(data_resize, timesteps, data_dim) # 1= timesteps
print(X.shape)
Y_shaped = Y.reshape(data_resize,timesteps)

# Split data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X_shaped, Y_shaped, test_size=0.3)
# always copy and paste your X_train, X_test etc. is correct by copying and pasting out the values

# Create the model
# expected input data shape: (batch_size, timesteps, data_dim)
# Dropout used to prevent over-fitting.
model = Sequential()
model.add(LSTM(36, return_sequences=True, input_shape=(timesteps, data_dim)))  # returns a sequence of vectors of dimension 40
model.add(Dropout(drop)) # dropout is to regularise it so won't learn too fast
model.add(LSTM(24,return_sequences=True))  # returns a sequence of vectors of dimension 40
model.add(Dropout(drop))
model.add(LSTM(16,return_sequences=True))  # returns a sequence of vectors of dimension 40
model.add(Dropout(drop))
model.add(LSTM(10))  # return a single vector of dimension 40
model.add(Dropout(drop))
model.add(Dense(num_classes, activation='sigmoid'))

model.compile(loss='binary_crossentropy', optimizer='rmsprop', metrics=['accuracy'])


# Train the model
model.fit(X_train, y_train, batch_size= batchsize, epochs=epoch_no, validation_data= (X_test, y_test))

#Evalute the model
loss, acc = model.evaluate(X_train, y_train, timesteps)

print("Keras: \n%s: %.2f%%" % (model.metrics_names[1], acc*100))

predictions = model.predict(X_train)
predictions = predictions.reshape(-1, 1).tolist()
y_train = y_train.reshape(-1, 1).tolist()
TP = 0
TN = 0
FP = 0
FN = 0

for i in range(len(predictions)):
    if predictions[i][0] >= 0.5 and y_train[i][0] == 1:
        TP += 1
    elif predictions[i][0] < 0.5 and y_train[i][0] == 0:
        TN += 1
    elif predictions[i][0] >= 0.5 and y_train[i][0] == 0:
        FP += 1
    else:
        FN += 1
print(TP, TN, FP, FN)
print("Trainset ==> Accuracy: %f, Precision: %f, Specificity: %f, Recall: %f, False Positive Rate: %f" % ((TP+TN)/(TP+TN+FP+FN), TP/(TP+FP), TN/(TN+FN), TP/(TP+FN), FP/(TN+FP)))

predictions2 = model.predict(X_test)
predictions2 = predictions2.reshape(-1, 1).tolist()
y_test = y_test.reshape(-1, 1).tolist()
TP = 0
TN = 0
FP = 0
FN = 0

for i in range(len(predictions2)):
    if predictions2[i][0] >= 0.5 and y_test[i][0] == 1:
        TP += 1
    elif predictions2[i][0] < 0.5 and y_test[i][0] == 0:
        TN += 1
    elif predictions2[i][0] >= 0.5 and y_test[i][0] == 0:
        FP += 1
    else:
        FN += 1
print(TP, TN, FP, FN)
print("Testset ==> Accuracy: %f, Precision: %f, Specificity: %f, Recall: %f, False Positive Rate: %f" % ((TP+TN)/(TP+TN+FP+FN), TP/(TP+FP), TN/(TN+FN), TP/(TP+FN), FP/(TN+FP)))