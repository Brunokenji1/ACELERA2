#include <NimBLEDevice.h>

// ===================== PINOS DOS BOTÕES =====================
#define BTN_J1  13   // Buzz Jogador 1
#define BTN_J2  12   // Buzz Jogador 2
#define BTN_A   11   // Alternativa A
#define BTN_B   10   // Alternativa B
#define BTN_C    9   // Alternativa C
#define BTN_D    3   // Alternativa D
#define BTN_E    8   // Alternativa E

// ===================== BLE / NUS UUIDs =====================
#define NUS_SERVICE_UUID      "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
#define NUS_TX_CHARACTERISTIC "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"

NimBLECharacteristic* pTxChar;
bool deviceConnected = false;

// ===================== MAPEAMENTO =====================
const int botaoPinos[] = { BTN_J1, BTN_J2, BTN_A, BTN_B, BTN_C, BTN_D, BTN_E };
const char* botaoMensagens[] = { "J1", "J2", "A", "B", "C", "D", "E" };
const int NUM_BOTOES = 7;

bool lastState[7];

// ===================== CALLBACKS BLE =====================
class ServerCallbacks : public NimBLEServerCallbacks {
  void onConnect(NimBLEServer* pServer, NimBLEConnInfo& connInfo) {
    deviceConnected = true;
    Serial.println("Conectado!");
  }
  void onDisconnect(NimBLEServer* pServer, NimBLEConnInfo& connInfo, int reason) {
    deviceConnected = false;
    NimBLEDevice::getAdvertising()->start();
    Serial.println("Desconectado, aguardando...");
  }
};

// ===================== SETUP =====================
void setup() {
  Serial.begin(115200);

  // Inicializa todos os botões com pull-up interno
  for (int i = 0; i < NUM_BOTOES; i++) {
    pinMode(botaoPinos[i], INPUT_PULLUP);
    lastState[i] = HIGH;
  }

  Serial.println("Iniciando BLE...");
  NimBLEDevice::init("StudyFlow_certo");
  NimBLEDevice::setPower(ESP_PWR_LVL_P9);

  NimBLEServer* pServer = NimBLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  NimBLEService* pService = pServer->createService(NUS_SERVICE_UUID);
  pTxChar = pService->createCharacteristic(
    NUS_TX_CHARACTERISTIC,
    NIMBLE_PROPERTY::NOTIFY
  );

  pService->start();

  NimBLEAdvertising* pAdvertising = NimBLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(NUS_SERVICE_UUID);
  pAdvertising->start();

  Serial.println("BLE pronto! Aguardando conexao...");
}

// ===================== LOOP =====================
void loop() {
  for (int i = 0; i < NUM_BOTOES; i++) {
    bool currentState = digitalRead(botaoPinos[i]);

    // Detecta borda de descida (botão pressionado)
    if (currentState == LOW && lastState[i] == HIGH) {
      Serial.print("Botao pressionado: ");
      Serial.print(botaoMensagens[i]);
      Serial.print(" | conectado: ");
      Serial.println(deviceConnected ? "SIM" : "NAO");

      if (deviceConnected) {
        pTxChar->setValue(botaoMensagens[i]);
        pTxChar->notify();
      }
    }

    lastState[i] = currentState;
  }

  delay(50); // debounce simples
}
