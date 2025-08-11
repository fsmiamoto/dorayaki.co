---
title: 'Embedded Systems are awesome!'
date: '2021-09-04'
tags: ['Embedded Systems']
categories: []
---

I've just finished my class of Embedded Systems in my university and
I have to say, it was an awesome experience.

As a guy that really likes low level stuff, understanding how a micro controller 
works internally to get to the point of running an actual Real Time Operating System (RTOS)
was really enjoyable.

Let's go through some of things you can learn while studying Embedded Systems :D

## Bare Metal?

We all have to start somewhere and that's bare metal, running code without 
an actual operating system behind it.

In this case you get to understand how the internal peripherals of the chip need to be
configured for some desired clock frequency, how to enable GPIO pins and even how
interrupts need to be handled.

As an example of what it looks like, the code below shows a simple finite state machine 
that goes through a Gray count and showing the count on the board's builtin LEDs:

```c
#include <stdint.h>
#include <stdbool.h>
#include "driverlib/systick.h"
#include "driverleds.h" 

#define SYSTICK_ONE_SEC_24MHZ_CLK 12000000

typedef enum {
  COUNT_000 = 0,
  COUNT_001 = LED3,
  COUNT_011 = LED2 | LED3,
  COUNT_010 = LED2,
  COUNT_110 = LED1 | LED2,
  COUNT_111 = LED1 | LED2 | LED3,
  COUNT_101 = LED1 | LED3,
  COUNT_100 = LED1,
} state_t;

volatile uint8_t tick = 0;
state_t state;

void SysTick_Handler(void){
  tick = 1;
} 

void setUp(void) {
  LEDInit(LED1 | LED2 | LED3);
  SysTickPeriodSet(SYSTICK_ONE_SEC_24MHZ_CLK);
  SysTickIntEnable();
  SysTickEnable();
}

void main(void){
  setUp();

  state = COUNT_000; 

  for(;;){
    if(tick){
      tick = 0;
      switch(state){
        case COUNT_000:
          state = COUNT_001;
          break;
        case COUNT_001:
          state = COUNT_011;
          break;
        case COUNT_011:
          state = COUNT_010;
          break;
        case COUNT_010:
          state = COUNT_110;
          break;
        case COUNT_110:
          state = COUNT_111;
          break;
        case COUNT_111:
          state = COUNT_101;
          break;
        case COUNT_101:
          state = COUNT_100;
          break;
        case COUNT_100:
          state = COUNT_000;
          break;
      } 
      LEDOn(state);
      LEDOff(~state);
    } 
  } 
} 
```

Full code available [here](https://github.com/fsmiamoto/TM4C1294_Bare_IAR9/tree/main/Projects/Laborat%C3%B3rio_03)

Well, it isn't much but it's a good starting point!

In this we had to *manually* initiate the hardware and enable interrupts - mostly in the `setUp` function -
calling the appropriate functions made available by the chip vendor, Texas Instruments in
this case.

Developing a bare metal solution can be all you need depending on the application but once
we need to have **concurrent** tasks, having to do it from scratch can get really difficult.

That's when a Real Time Operating System (RTOS) comes in handy.

## Real Time?

To start, what does exactly *Real Time* mean in here?

Simply put, it means that tasks executing on a RTOS have a **deadline** and with that a 
very important separation appears between **soft** and **hard** real time systems.

### Hard and Soft
Although these definitions might have some room for different interpretations, the
following describe the general idea:

- **Hard real time**: systems that have **serious consequences** when deadlines are not respected - usually involving human injuries.
- **Soft real time**: systems that **might tolerate** missing some deadlines, even though it is not
  desirable.

An example for a hard real time system is one that controls a safety critical system such
as ABS.

For soft real time, we can consider applications such as video streaming where not hitting
the deadlines might cause some stutter but no one gets harmed with that, right? 

> Ok, maybe the remote control might get thrown at the TV but still, no human injuries are
expected :)

But how do we manage running tasks in a real time OS?

For most embedded applications you might only have a single computing core so the task
becomes even more interesting.

With that, we need to get into *concurrency controls* and *scheduling algorithms*, two operating
systems topics that I really like!

Both are huge topics but you'll definitely need to remember all those things from your
Operating Systems class, including semaphores, mutexes, message queues, task priority,
starvation and much more :D

## First RTOS example

Let's start with a simple example, just blinking 4 LEDs at different
frequencies.

In this example, we create 4 threads - one for each LED - which has a *body* that simply
switches a particular LED on and off and waits for the given amount of time.

```c
#include "cmsis_os2.h"
#include "driverleds.h"
#include "system_tm4c1294.h"

typedef struct {
  osThreadId_t thread_id;
  uint8_t led_number;         // One of LED1, LED2, LED3, LED4
  uint32_t activation_period; // Number of system ticks
} led_blink_t;

#define NUM_OF_BLINKERS sizeof(blinkers)/sizeof(led_blink_t)

led_blink_t blinkers[] = {
    {.led_number = LED1, .activation_period = 200},
    {.led_number = LED2, .activation_period = 300},
    {.led_number = LED3, .activation_period = 500},
    {.led_number = LED4, .activation_period = 700},
};

void blinker(void *arg) {
  uint8_t state = 0;
  uint32_t tick;
  led_blink_t *b = (led_blink_t *)arg;

  for (;;) {
    tick = osKernelGetTickCount();
    state ^= b->led_number;
    LEDWrite(b->led_number, state);
    osDelayUntil(tick + b->activation_period);
  }
}

void main(void) {
  LEDInit(LED1 | LED2 | LED3 | LED4);

  osKernelInitialize();

  for (int i = 0; i < NUM_OF_BLINKERS; i++)
    blinkers[i].thread_id = osThreadNew(blinker, &blinkers[i], NULL);

  if (osKernelGetState() == osKernelReady)
    osKernelStart();

  // NOT REACHED
  while (1)
    ;
}
```

Full code available [here](https://github.com/fsmiamoto/TM4C1294_RTOS_IAR9/blob/main/Projects/Lab04/src/main.c)

Here we can already see the advantages of using a RTOS since we don't need
to think too much about how the tasks will be scheduled on the CPU (not for this simple
one at least).

But now let's see a more elaborate example, where a RTOS can **really** shine.

## PWM'ing 4 LEDs concurrently

In this final example, we'll have the same 4 threads managing one LED but this time using
[Pulse Width Modulation](https://en.wikipedia.org/wiki/Pulse-width_modulation) (PWM). 
The threads read from a *message queue* that signals whether the duty cycle should increase.

Messages are queued by a **manager** thread which also receives messages from a queue
that signals that the development board built-in push button was pressed.

There's a set number of steps, after which the duty cycle goes back to the lowest possible
value.

The architecture of the code can be seen below:
![Architecture](https://raw.githubusercontent.com/fsmiamoto/TM4C1294_RTOS_IAR9/main/Projects/Lab06/diagramas/architecture.png)

```c
#include "cmsis_os2.h"
#include "driverbuttons.h"
#include "driverleds.h"
#include "pwm.h"
#include "system_TM4C1294.h"
#include <stdint.h>

#define LEDs LED1 | LED2 | LED3 | LED4

#define NUM_OF_WORKERS (sizeof(workers) / sizeof(worker_t))

#define WORKER_QUEUE_SIZE 8U
#define MANAGER_QUEUE_SIZE 8U

#define DEBOUNCE_TICKS 300U

#define NO_WAIT 0U
#define MSG_PRIO 0U

#define PWM_PERIOD 10U   // ms
#define BLINK_PERIOD 50U // ms

// Push buttons are active in 0
#define ButtonPressed(b) !ButtonRead(b)

#define notifySelectedWorker()                                                 \\
  osMessageQueuePut(workers[selected_worker].args.queue_id, &notification,     \\
                    MSG_PRIO, osWaitForever)

typedef enum {
  SW1_PRESSED,
  SW2_PRESSED,
} button_event_t;

// Notification to workers, no content needed.
typedef uint8_t manager_notif_t;

// worker_args_t represents the arguments for a worker thread
typedef struct {
  osMessageQueueId_t queue_id;
  uint8_t led_number; // One of LED1, LED2, LED3 and LED4.
  uint16_t on_time;   // In ms
  uint16_t period;    // In ms
} worker_args_t;

// worker_t represents a worker thread and it's arguments
typedef struct {
  osThreadId_t thread_id;
  worker_args_t args;
} worker_t;

// manager_t represents a manager thread
typedef struct {
  osThreadId_t thread_id;
  osMessageQueueId_t queue_id;
} manager_t;

osMutexId_t led_mutex_id;
const osMutexAttr_t led_mutex_attr = {"LEDMutex", osMutexPrioInherit, NULL, 0U};

manager_t manager;
worker_t workers[] = {
    {.args = {.led_number = LED1, .period = BLINK_PERIOD, .on_time = 5}},
    {.args = {.led_number = LED2, .period = PWM_PERIOD, .on_time = 2}},
    {.args = {.led_number = LED3, .period = PWM_PERIOD, .on_time = 8}},
    {.args = {.led_number = LED4, .period = PWM_PERIOD, .on_time = 0}},
};

void main(void) {
  initializeHardware();
  osKernelInitialize();
  initializeManager();
  initializeWorkers();
  led_mutex_id = osMutexNew(&led_mutex_attr);

  if (osKernelGetState() == osKernelReady)
    osKernelStart();

  // NOT REACHED
  while (1)
    ;
}

// Manager is the body of the manager thread.
// It receives events through a queue and notifies
// workers that need to update their values.
void Manager(void *arg) {
  button_event_t event;
  manager_notif_t notification;
  uint8_t selected_worker = 0;

  for (;;) {
    osMessageQueueGet(manager.queue_id, &event, NULL, osWaitForever);

    switch (event) {
    case SW1_PRESSED:
      // We need to restore the PWM period of the current selected worker
      workers[selected_worker].args.period = PWM_PERIOD;
      notifySelectedWorker();

      selected_worker = (selected_worker + 1) % NUM_OF_WORKERS;

      workers[selected_worker].args.period = BLINK_PERIOD;
      notifySelectedWorker();
      break;
    case SW2_PRESSED:
      workers[selected_worker].args.on_time += 1;
      if (workers[selected_worker].args.on_time > PWM_PERIOD)
        workers[selected_worker].args.on_time = 0;
      notifySelectedWorker();
      break;
    }
  }
}

// Worker is the body of worker threads.
// It polls for notifications from the manager thread and
// updates it's argument values if needed.
void Worker(void *arg) {
  worker_args_t *args = (worker_args_t *)arg;
  manager_notif_t notification;
  osStatus_t status;

  osMessageQueueId_t queue_id = args->queue_id;
  uint8_t led_number = args->led_number;
  uint8_t on_time = args->on_time;
  uint16_t period = args->period;

  for (;;) {
    status = osMessageQueueGet(queue_id, &notification, NULL, NO_WAIT);
    if (status == osOK) {
      // Notification received, update values
      on_time = args->on_time;
      period = args->period;
    }
    SwitchOn(led_number);
    osDelay(on_time);
    SwitchOff(led_number);
    osDelay(period - on_time);
  }
}

void GPIOJ_Handler(void) {
  // Used for debouncing
  static uint32_t tick_last_msg_sw1, tick_last_msg_sw2;

  ButtonIntClear(USW1 | USW2);

  if (ButtonPressed(USW1)) {
    if ((osKernelGetTickCount() - tick_last_msg_sw1) < DEBOUNCE_TICKS)
      return;

    button_event_t event = SW1_PRESSED;
    osStatus_t status =
        osMessageQueuePut(manager.queue_id, &event, MSG_PRIO, NO_WAIT);
    if (status == osOK)
      tick_last_msg_sw1 = osKernelGetTickCount();
  }

  if (ButtonPressed(USW2)) {
    if ((osKernelGetTickCount() - tick_last_msg_sw2) < DEBOUNCE_TICKS)
      return;

    button_event_t event = SW2_PRESSED;
    osStatus_t status =
        osMessageQueuePut(manager.queue_id, &event, MSG_PRIO, NO_WAIT);
    if (status == osOK)
      tick_last_msg_sw2 = osKernelGetTickCount();
  }
}

// SwitchOn switches on a led in a thread-safe manner
void SwitchOn(uint8_t led) {
  osMutexAcquire(led_mutex_id, osWaitForever);
  LEDOn(led);
  osMutexRelease(led_mutex_id);
}

// SwitchOff switches off a led in a thread-safe manner
void SwitchOff(uint8_t led) {
  osMutexAcquire(led_mutex_id, osWaitForever);
  LEDOff(led);
  osMutexRelease(led_mutex_id);
}

void initializeHardware(void) {
  LEDInit(LEDs);
  ButtonInit(USW1 | USW2);
  ButtonIntEnable(USW1 | USW2);
}

void initializeWorkers(void) {
  for (int i = 0; i < NUM_OF_WORKERS; i++) {
    workers[i].args.queue_id =
        osMessageQueueNew(WORKER_QUEUE_SIZE, sizeof(manager_notif_t), NULL);
    workers[i].thread_id = osThreadNew(Worker, &workers[i].args, NULL);
  }
}

void initializeManager(void) {
  manager.thread_id = osThreadNew(Manager, NULL, NULL);
  manager.queue_id =
      osMessageQueueNew(MANAGER_QUEUE_SIZE, sizeof(button_event_t), NULL);
}
```

For this example we can see the use of some concurrency control mechanisms such as the
mutex, used from controlling the access to the underlying register that sets the LEDs on
or off.

The messaging between threads is another key mechanism for communicating between code
running concurrently and that we get 'for free' when using a RTOS.

## Final thoughts

Although I don't have any professional experience dealing with Embedded Systems, the low
level nature of coding in this environment is something I **really** enjoy and I hope I
was able to show some of this excitement to you.

Cheers!