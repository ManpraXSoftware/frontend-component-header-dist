function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';
import { getConfig } from '@edx/frontend-platform';
class AudioSearch extends Component {
  constructor(props) {
    var _this;
    super(props);
    _this = this;
    _defineProperty(this, "clearAllTimeouts", () => {
      if (this.recordingTimeoutRef.current) {
        clearTimeout(this.recordingTimeoutRef.current);
        this.recordingTimeoutRef.current = null;
      }
      if (this.speechDetectionTimeoutRef.current) {
        clearTimeout(this.speechDetectionTimeoutRef.current);
        this.speechDetectionTimeoutRef.current = null;
      }
      if (this.interimTimeoutRef.current) {
        clearTimeout(this.interimTimeoutRef.current);
        this.interimTimeoutRef.current = null;
      }
      this.setState({
        debugMessage: 'All timeouts cleared',
        timestamp: new Date().toISOString()
      });
    });
    _defineProperty(this, "handleEscKey", event => {
      if (event.key === 'Escape' && this.state.showModal && !this.isStoppingRef.current) {
        event.stopPropagation();
        event.preventDefault();
        console.log('ESC key detected', {
          showModal: this.state.showModal,
          timestamp: new Date().toISOString()
        });
        this.audioChunksRef.current = [];
        this.isStartingRef.current = false;
        this.isStoppingRef.current = false;
        this.handleStopRecording();
      }
    });
    _defineProperty(this, "stopAllTracks", () => {
      if (this.streamRef.current) {
        this.streamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log(`Track ${track.id} (${track.kind}) stopped`, {
            readyState: track.readyState,
            timestamp: new Date().toISOString()
          });
          this.setState({
            debugMessage: `Track ${track.id} stopped`
          });
        });
        this.streamRef.current = null;
      }
      this.setState({
        debugMessage: 'All tracks stopped'
      });
    });
    _defineProperty(this, "initializeSpeechRecognition", function () {
      let langOverride = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      const {
        currentLang
      } = _this.props;
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        if (_this.recognitionRef.current) {
          _this.recognitionRef.current.onresult = null;
          _this.recognitionRef.current.onerror = null;
          _this.recognitionRef.current.onend = null;
          try {
            _this.recognitionRef.current.stop();
            console.log('Previous SpeechRecognition stopped', {
              timestamp: new Date().toISOString()
            });
            _this.setState({
              debugMessage: 'Previous SpeechRecognition stopped'
            });
          } catch (error) {
            console.log('SpeechRecognition already stopped or not started:', error.message, {
              timestamp: new Date().toISOString()
            });
          }
        }
        _this.recognitionRef.current = new SpeechRecognition();
        const lang = langOverride || currentLang || 'en-US';
        _this.recognitionRef.current.lang = lang;
        _this.recognitionRef.current.interimResults = true;
        _this.recognitionRef.current.continuous = true;
        console.log('SpeechRecognition initialized', {
          lang,
          currentLang,
          langOverride,
          timestamp: new Date().toISOString()
        });
        _this.setState({
          debugMessage: `SpeechRecognition initialized, lang: ${lang}`
        });
      }
    });
    _defineProperty(this, "startSpeechRecognition", () => {
      if (!this.recognitionRef.current || !this.streamRef.current || !this.streamRef.current.active) {
        console.error('Cannot start SpeechRecognition: recognition or stream not ready', {
          recognition: !!this.recognitionRef.current,
          streamActive: this.streamRef.current?.active,
          streamTracks: this.streamRef.current?.getTracks().map(t => ({
            id: t.id,
            enabled: t.enabled,
            readyState: t.readyState
          })),
          timestamp: new Date().toISOString()
        });
        this.setState({
          debugMessage: 'Cannot start SpeechRecognition: recognition or stream not ready',
          finalText: 'Microphone or recognition not ready. Please check microphone permissions and try again.',
          showModal: true,
          isListening: false,
          canRespeak: true
        });
        return false;
      }
      try {
        this.recognitionRef.current.start();
        console.log('SpeechRecognition start called', {
          timestamp: new Date().toISOString()
        });
        this.setState({
          debugMessage: 'Speech recognition started'
        });
        return true;
      } catch (error) {
        console.error('Error starting SpeechRecognition:', {
          error: error.message,
          timestamp: new Date().toISOString()
        });
        this.setState({
          debugMessage: `Error starting SpeechRecognition: ${error.message}`,
          canRespeak: true
        });
        return false;
      }
    });
    _defineProperty(this, "handleAudioSearch", async function () {
      let keepModalOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (_this.isStartingRef.current || _this.isStoppingRef.current) {
        console.log('Audio search or cleanup in progress, ignoring', {
          timestamp: new Date().toISOString()
        });
        _this.setState({
          debugMessage: 'Audio search or cleanup in progress, ignoring',
          canRespeak: true
        });
        return;
      }
      _this.isStartingRef.current = true;
      console.log('handleAudioSearch started', {
        currentLang: _this.props.currentLang,
        browser: navigator.userAgent,
        timestamp: new Date().toISOString()
      });

      // Log available microphones
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(device => device.kind === 'audioinput');
        console.log('Available audio devices:', audioDevices.map(d => ({
          deviceId: d.deviceId,
          label: d.label
        })), {
          timestamp: new Date().toISOString()
        });
        _this.setState({
          debugMessage: `Available audio devices: ${audioDevices.length}`
        });
      } catch (error) {
        console.error('Error enumerating audio devices:', {
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
      _this.setState({
        showModal: true,
        isListening: true,
        interimText: '',
        finalText: '',
        debugMessage: 'Initializing audio search...',
        canRespeak: false,
        transcriptBuffer: []
      });

      // Reset existing MediaRecorder
      if (_this.mediaRecorder.current) {
        console.log('Clearing existing MediaRecorder', {
          state: _this.mediaRecorder.current?.state || 'null',
          timestamp: new Date().toISOString()
        });
        _this.mediaRecorder.current.onstop = null;
        _this.mediaRecorder.current.ondataavailable = null;
        if (_this.mediaRecorder.current.state !== 'inactive') {
          _this.mediaRecorder.current.stop();
        }
        _this.mediaRecorder.current = null;
      }
      _this.audioChunksRef.current = [];
      _this.setState({
        debugMessage: 'Audio chunks initialized'
      });
      _this.stopAllTracks();

      // Initialize fresh SpeechRecognition
      _this.initializeSpeechRecognition();
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition || !_this.recognitionRef.current) {
        _this.setState({
          debugMessage: 'Speech recognition not supported in this browser.',
          // finalText: 'Speech recognition not supported. Please use a supported browser like Chrome.',
          isListening: false,
          showModal: true,
          canRespeak: true
        });
        alert('Speech recognition not supported in this browser.');
        _this.isStartingRef.current = false;
        return;
      }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        _this.setState({
          debugMessage: 'Microphone access not supported.',
          // finalText: 'Microphone access not supported. Please use a supported browser.',
          isListening: false,
          showModal: true,
          canRespeak: true
        });
        alert('Microphone access not supported in this browser.');
        _this.isStartingRef.current = false;
        return;
      }
      if (!window.isSecureContext) {
        _this.setState({
          debugMessage: 'Microphone access requires a secure context (HTTPS or localhost).',
          // finalText: 'Microphone access requires HTTPS. Please access this site via a secure connection.',
          isListening: false,
          showModal: true,
          canRespeak: true
        });
        alert('Microphone access requires a secure context (HTTPS).');
        _this.isStartingRef.current = false;
        return;
      }
      let mimeType = 'audio/wav';
      if (!MediaRecorder.isTypeSupported('audio/wav')) {
        mimeType = 'audio/webm';
        _this.setState({
          debugMessage: 'Falling back to MIME type: audio/webm'
        });
      } else {
        _this.setState({
          debugMessage: 'Using MIME type: audio/wav'
        });
      }
      try {
        _this.setState({
          debugMessage: 'Requesting microphone for shared stream...'
        });
        _this.streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: 16000,
            channelCount: 1
          }
        });
        console.log('Microphone stream acquired', {
          active: _this.streamRef.current.active,
          tracks: _this.streamRef.current.getTracks().map(t => ({
            id: t.id,
            enabled: t.enabled,
            readyState: t.readyState
          })),
          timestamp: new Date().toISOString()
        });
        _this.setState({
          debugMessage: 'Microphone stream acquired'
        });

        // Validate stream before MediaRecorder
        if (!_this.streamRef.current || !_this.streamRef.current.active || _this.streamRef.current.getAudioTracks().length === 0) {
          console.error('Invalid stream for MediaRecorder', {
            streamExists: !!_this.streamRef.current,
            streamActive: _this.streamRef.current?.active,
            audioTracks: _this.streamRef.current?.getAudioTracks().map(t => ({
              id: t.id,
              enabled: t.enabled,
              readyState: t.readyState
            })),
            timestamp: new Date().toISOString()
          });
          _this.setState({
            debugMessage: 'Invalid microphone stream for MediaRecorder',
            // finalText: 'Microphone stream failed to activate. Please check microphone permissions or try a different device.',
            isListening: false,
            showModal: true,
            canRespeak: true
          });
          _this.stopAllTracks();
          _this.isStartingRef.current = false;
          return;
        }
        _this.mediaRecorder.current = new MediaRecorder(_this.streamRef.current, {
          mimeType
        });
        console.log('MediaRecorder initialized', {
          mediaRecorder: !!_this.mediaRecorder.current,
          timestamp: new Date().toISOString()
        });
        _this.mediaRecorder.current.onstart = () => {
          console.log('MediaRecorder started', {
            state: _this.mediaRecorder.current?.state || 'null',
            timestamp: new Date().toISOString()
          });
          _this.setState({
            debugMessage: `MediaRecorder started, state: ${_this.mediaRecorder.current?.state || 'null'}`
          });
        };
        _this.mediaRecorder.current.onstop = async () => {
          console.log('MediaRecorder onstop triggered', {
            isStopping: _this.isStoppingRef.current,
            chunks: _this.audioChunksRef.current.length,
            timestamp: new Date().toISOString()
          });
          const totalSize = _this.audioChunksRef.current.reduce((sum, chunk) => sum + chunk.size, 0) || 0;
          if (_this.audioChunksRef.current.length === 0) {
            console.log('Skipping transcription: no audio chunks collected', {
              length: _this.audioChunksRef.current.length,
              totalSize,
              timestamp: new Date().toISOString()
            });
            _this.setState({
              debugMessage: 'No speech detected. Please speak clearly and try again.',
              // finalText: 'No speech detected. Please speak clearly and try again.',
              showModal: true,
              isListening: false,
              canRespeak: true
            });
            _this.audioChunksRef.current = [];
            _this.stopAllTracks();
            _this.mediaRecorder.current = null;
            _this.isStartingRef.current = false;
            _this.isStoppingRef.current = false;
            return;
          }
          const audioBlob = new Blob(_this.audioChunksRef.current, {
            type: mimeType
          });
          _this.stopAllTracks();
          _this.mediaRecorder.current = null;
          _this.setState({
            debugMessage: `Sending audio to transcription API, MIME: ${mimeType}, size: ${audioBlob.size}`
          });
          const formData = new FormData();
          formData.append('audio', audioBlob, `recording.${mimeType.split('/')[1]}`);
          formData.append('language', _this.props.currentLang || 'en-US');
          try {
            // console.log('Attempting transcription API call', { url: `${getConfig().LMS_BASE_URL}/explore-courses/api/transcribe-audio/`, timestamp: new Date().toISOString() });
            const response = await fetch(`${getConfig().LMS_BASE_URL}/explore-courses/api/transcribe-audio/`, {
              method: 'POST',
              body: formData
            });
            const data = await response.json();
            console.log('Transcription API response:', {
              status: response.status,
              data,
              timestamp: new Date().toISOString()
            });
            if (response.ok && data.text) {
              _this.setState({
                finalText: data.text,
                debugMessage: 'Transcription successful: ' + data.text,
                isListening: false,
                canRespeak: true
              });
              // this.props.onTextUpdate(data.text);
            } else {
              console.error('Transcription API error:', {
                status: response.status,
                error: data.error || 'Unknown error',
                timestamp: new Date().toISOString()
              });
              _this.setState({
                // finalText: 'Failed to transcribe audio: ' + (data.error || 'Unknown error'),
                debugMessage: 'Transcription error: ' + (data.error || 'Unknown error'),
                showModal: true,
                isListening: false,
                canRespeak: true
              });
              // alert('Failed to transcribe audio: ' + (data.error || 'Unknown error'));
            }
          } catch (error) {
            console.error('Transcription fetch error:', {
              error: error.message,
              timestamp: new Date().toISOString()
            });
            _this.setState({
              // finalText: 'Error processing audio: ' + error.message,
              debugMessage: 'Fetch error: ' + error.message,
              showModal: true,
              isListening: false,
              canRespeak: true
            });
            // alert('Error processing audio: ' + error.message);
          }
          _this.audioChunksRef.current = [];
          _this.isStartingRef.current = false;
          _this.isStoppingRef.current = false;
        };
        _this.mediaRecorder.current.ondataavailable = event => {
          if (event.data.size > 0) {
            _this.audioChunksRef.current.push(event.data);
            _this.setState({
              debugMessage: `Audio chunk received, size: ${event.data.size}, total chunks: ${_this.audioChunksRef.current.length}`
            });
          } else {
            _this.setState({
              debugMessage: 'Empty or ignored audio chunk received'
            });
          }
        };
        _this.mediaRecorder.current.start(100);
        console.log('MediaRecorder start called', {
          state: _this.mediaRecorder.current?.state || 'null',
          timestamp: new Date().toISOString()
        });
        _this.setState({
          debugMessage: `MediaRecorder start called, state: ${_this.mediaRecorder.current?.state || 'null'}`
        });
        _this.recognitionRef.current.onresult = event => {
          console.log('Speech recognition onresult:', {
            results: event.results,
            timestamp: new Date().toISOString()
          });
          if (!event.results || !event.results[0] || !event.results[0][0]) {
            _this.setState({
              debugMessage: 'Invalid results structure',
              canRespeak: true
            });
            return;
          }
          let interim = '';
          const newBuffer = [..._this.state.transcriptBuffer];
          for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              interim += transcript + ' ';
              newBuffer.push({
                text: transcript,
                isFinal: true,
                confidence: event.results[i][0].confidence
              });
            } else {
              interim += transcript;
              newBuffer.push({
                text: transcript,
                isFinal: false,
                confidence: event.results[i][0].confidence
              });
            }
          }
          console.log('Speech result details:', {
            transcript: interim,
            isFinal: event.results[0].isFinal,
            confidence: event.results[0][0].confidence,
            buffer: newBuffer,
            timestamp: new Date().toISOString()
          });
          _this.setState({
            interimText: interim,
            transcriptBuffer: newBuffer,
            debugMessage: `Interim text: ${interim}, isFinal: ${event.results[0].isFinal}, confidence: ${event.results[0][0].confidence}`
          });
          if (_this.speechDetectionTimeoutRef.current) {
            clearTimeout(_this.speechDetectionTimeoutRef.current);
            _this.speechDetectionTimeoutRef.current = null;
          }
          if (event.results[0].isFinal) {
            const finalTranscript = newBuffer.filter(t => t.isFinal).map(t => t.text).join(' ').trim();
            // this.setState({ finalText: finalTranscript, isListening: false, canRespeak: true, transcriptBuffer: [] });
            _this.setState({
              isListening: false,
              transcriptBuffer: []
            });
            // this.props.onTextUpdate(finalTranscript);
            if (_this.mediaRecorder.current && _this.mediaRecorder.current.state !== 'inactive') {
              // console.log('Stopping MediaRecorder after final result', { timestamp: new Date().toISOString() });
              _this.mediaRecorder.current.stop();
            }
            if (_this.interimTimeoutRef.current) {
              clearTimeout(_this.interimTimeoutRef.current);
              _this.interimTimeoutRef.current = null;
            }
          } else {
            if (!_this.interimTimeoutRef.current) {
              _this.interimTimeoutRef.current = setTimeout(() => {
                if (_this.mediaRecorder.current && _this.mediaRecorder.current.state !== 'inactive') {
                  const finalTranscript = _this.state.transcriptBuffer.map(t => t.text).join(' ').trim();
                  // console.log('Stopping MediaRecorder after prolonged interim results', { finalTranscript, timestamp: new Date().toISOString() });
                  _this.mediaRecorder.current.stop();
                  // this.setState({ finalText: finalTranscript, debugMessage: 'Finalized interim text due to timeout', isListening: false, canRespeak: true, transcriptBuffer: [] });
                  _this.setState({
                    debugMessage: 'Finalized interim text due to timeout',
                    isListening: false,
                    transcriptBuffer: []
                  });
                  // this.props.onTextUpdate(finalTranscript);
                }
                _this.interimTimeoutRef.current = null;
              }, 4000);
            }
          }
        };
        _this.recognitionRef.current.onerror = event => {
          console.log('Speech recognition error details:', {
            error: event.error,
            timestamp: new Date().toISOString()
          });
          _this.setState({
            debugMessage: `Speech recognition error: ${event.error}`,
            // finalText: `Error: ${event.error}. Please check microphone permissions or try again.`,
            showModal: true,
            isListening: false,
            canRespeak: true
          });
          // alert(`Speech recognition error: ${event.error}. Please check microphone permissions or try again.`);
          _this.handleStopRecording();
        };
        _this.recognitionRef.current.onend = () => {
          // console.log('Speech recognition ended', { isListening: this.state.isListening, isStopping: this.isStoppingRef.current, timestamp: new Date().toISOString() });
          _this.setState({
            debugMessage: 'Speech recognition ended'
          });
          if (_this.state.isListening && !_this.isStoppingRef.current) {
            setTimeout(() => {
              if (!_this.isStoppingRef.current && !_this.isStartingRef.current && _this.recognitionRef.current) {
                try {
                  _this.initializeSpeechRecognition();
                  if (_this.startSpeechRecognition()) {
                    _this.setState({
                      debugMessage: 'Speech recognition restarted',
                      canRespeak: false
                    });
                  } else {
                    _this.setState({
                      debugMessage: 'Failed to restart SpeechRecognition',
                      canRespeak: true
                    });
                  }
                  _this.isStartingRef.current = false;
                } catch (error) {
                  console.error('Error restarting recognition:', {
                    error: error.message,
                    timestamp: new Date().toISOString()
                  });
                  _this.setState({
                    debugMessage: `Error restarting recognition: ${error.message}`,
                    // finalText: `Error: ${error.message}`,
                    showModal: true,
                    isListening: false,
                    canRespeak: true
                  });
                }
              }
            }, 1000);
          } else {
            _this.isStartingRef.current = false;
            _this.isStoppingRef.current = false;
          }
        };

        // console.log('Attempting to start SpeechRecognition', { streamActive: this.streamRef.current?.active, timestamp: new Date().toISOString() });
        if (!_this.streamRef.current || !_this.streamRef.current.active || _this.streamRef.current.getAudioTracks().length === 0) {
          console.error('Microphone stream not ready for SpeechRecognition', {
            streamExists: !!_this.streamRef.current,
            streamActive: _this.streamRef.current?.active,
            tracks: _this.streamRef.current?.getTracks().map(t => ({
              id: t.id,
              kind: t.kind,
              enabled: t.enabled,
              readyState: t.readyState
            })),
            timestamp: new Date().toISOString()
          });
          _this.setState({
            debugMessage: 'Microphone stream not ready for SpeechRecognition',
            // finalText: 'Microphone stream failed to activate. Please check microphone permissions or try a different device.',
            isListening: false,
            showModal: true,
            canRespeak: true
          });
          _this.stopAllTracks();
          _this.isStartingRef.current = false;
          return;
        }
        if (_this.startSpeechRecognition()) {
          _this.setState({
            debugMessage: 'SpeechRecognition started successfully'
          });
        } else {
          console.error('SpeechRecognition start failed', {
            timestamp: new Date().toISOString()
          });
          _this.setState({
            debugMessage: 'SpeechRecognition start failed',
            // finalText: 'Failed to start speech recognition. Please check microphone permissions or try a different device.',
            isListening: false,
            showModal: true,
            canRespeak: true
          });
          _this.stopAllTracks();
          _this.isStartingRef.current = false;
        }
        _this.speechDetectionTimeoutRef.current = setTimeout(() => {
          if (_this.state.isListening && !_this.isStoppingRef.current && !_this.state.interimText && !_this.state.finalText && _this.state.transcriptBuffer.length === 0) {
            console.log('No speech detected within 10 seconds', {
              timestamp: new Date().toISOString()
            });
            _this.setState({
              debugMessage: 'No speech detected within 10 seconds',
              // finalText: 'No speech detected. Please speak clearly and try again.', 
              isListening: false,
              showModal: true,
              canRespeak: true
            });
            _this.handleStopRecording();
          }
        }, 10000);
        _this.recordingTimeoutRef.current = setTimeout(() => {
          if (_this.state.isListening && !_this.isStoppingRef.current) {
            console.log('Recording timeout triggered', {
              timestamp: new Date().toISOString()
            });
            const finalTranscript = _this.state.transcriptBuffer.map(t => t.text).join(' ').trim();
            _this.setState({
              debugMessage: 'Recording timeout: stopping',
              finalText: finalTranscript || 'Recording timed out. Please speak again.',
              showModal: true,
              isListening: false,
              canRespeak: true,
              transcriptBuffer: []
            });
            // this.props.onTextUpdate(finalTranscript);
            _this.handleStopRecording();
          }
        }, 20000);
      } catch (error) {
        console.error('Unexpected error in handleAudioSearch:', {
          error: error.message,
          timestamp: new Date().toISOString()
        });
        _this.setState({
          debugMessage: 'Unexpected error: ' + error.message,
          // finalText: 'Unexpected error: ' + error.message,
          isListening: false,
          showModal: true,
          canRespeak: true
        });
        // alert('Unexpected error: ' + error.message);
        _this.stopAllTracks();
        _this.isStartingRef.current = false;
        _this.isStoppingRef.current = false;
      }
    });
    _defineProperty(this, "handleStopRecording", () => {
      if (this.isStoppingRef.current) {
        console.log('Stop recording ignored: already stopping', {
          timestamp: new Date().toISOString()
        });
        this.setState({
          debugMessage: 'Stop recording ignored: already stopping'
        });
        return;
      }

      // this.isStoppingRef.current = true;
      this.isStoppingRef.current = false;
      console.log('Stop recording initiated', {
        showModal: this.state.showModal,
        isListening: this.state.isListening,
        timestamp: new Date().toISOString()
      });
      this.setState({
        debugMessage: 'Stop recording initiated',
        isListening: false,
        showModal: false
      });
      this.clearAllTimeouts();
      this.stopAllTracks();
      if (this.recognitionRef.current) {
        try {
          this.recognitionRef.current.stop();
          this.recognitionRef.current.onresult = null;
          this.recognitionRef.current.onerror = null;
          this.recognitionRef.current.onend = null;
          this.recognitionRef.current = null;
          console.log('Speech recognition stopped and cleared', {
            timestamp: new Date().toISOString()
          });
          this.setState({
            debugMessage: 'Speech recognition stopped and cleared'
          });
        } catch (error) {
          console.error('Error stopping speech recognition:', {
            error: error.message,
            timestamp: new Date().toISOString()
          });
          this.setState({
            debugMessage: `Error stopping speech recognition: ${error.message}`
          });
        }
      }
      if (this.mediaRecorder.current) {
        try {
          if (this.mediaRecorder.current.state !== 'inactive') {
            console.log('MediaRecorder stop triggered', {
              state: this.mediaRecorder.current.state,
              timestamp: new Date().toISOString()
            });
            this.mediaRecorder.current.stop();
            this.setState({
              debugMessage: `MediaRecorder stop triggered, state: ${this.mediaRecorder.current.state}`
            });
          }
          this.mediaRecorder.current.onstop = null;
          this.mediaRecorder.current.ondataavailable = null;
          this.mediaRecorder.current = null;
          console.log('MediaRecorder fully cleared', {
            timestamp: new Date().toISOString()
          });
          this.setState({
            debugMessage: 'MediaRecorder fully cleared'
          });
        } catch (error) {
          console.error('Error stopping MediaRecorder:', {
            error: error.message,
            timestamp: new Date().toISOString()
          });
          this.setState({
            debugMessage: `Error stopping MediaRecorder: ${error.message}`
          });
        }
      }
      this.audioChunksRef.current = [];
      this.setState({
        interimText: '',
        finalText: '',
        transcriptBuffer: [],
        isListening: false,
        showModal: false,
        canRespeak: true,
        debugMessage: 'Recording stopped, resources cleared'
      });
      this.isStartingRef.current = false;
      this.isStoppingRef.current = false;
      console.log('Stop recording completed', {
        isStarting: this.isStartingRef.current,
        isStopping: this.isStoppingRef.current,
        showModal: this.state.showModal,
        timestamp: new Date().toISOString()
      });
    });
    _defineProperty(this, "resetRecording", () => {
      console.log('resetRecording called', {
        isStarting: this.isStartingRef.current,
        isStopping: this.isStoppingRef.current,
        isListening: this.state.isListening,
        timestamp: new Date().toISOString()
      });
      if (this.isStoppingRef.current || this.isStartingRef.current) {
        console.log('Reset recording ignored: recording or cleanup in progress', {
          timestamp: new Date().toISOString()
        });
        this.setState({
          debugMessage: 'Reset recording ignored: recording or cleanup in progress'
        });
        return;
      }
      this.clearAllTimeouts();
      this.stopAllTracks();
      if (this.recognitionRef.current) {
        try {
          this.recognitionRef.current.stop();
          this.recognitionRef.current.onresult = null;
          this.recognitionRef.current.onerror = null;
          this.recognitionRef.current.onend = null;
          this.recognitionRef.current = null;
          // console.log('Speech recognition stopped and cleared for reset', { timestamp: new Date().toISOString() });
          this.setState({
            debugMessage: 'Speech recognition stopped and cleared for reset'
          });
        } catch (error) {
          console.error('Error stopping speech recognition for reset:', {
            error: error.message,
            timestamp: new Date().toISOString()
          });
          this.setState({
            debugMessage: `Error stopping speech recognition for reset: ${error.message}`
          });
        }
      }
      if (this.mediaRecorder.current) {
        try {
          if (this.mediaRecorder.current.state !== 'inactive') {
            // console.log('MediaRecorder stop triggered for reset', { state: this.mediaRecorder.current.state, timestamp: new Date().toISOString() });
            this.mediaRecorder.current.stop();
            this.setState({
              debugMessage: `MediaRecorder stop triggered for reset, state: ${this.mediaRecorder.current.state}`
            });
          }
          this.mediaRecorder.current.onstop = null;
          this.mediaRecorder.current.ondataavailable = null;
          this.mediaRecorder.current = null;
          // console.log('MediaRecorder fully cleared for reset', { timestamp: new Date().toISOString() });
          this.setState({
            debugMessage: 'MediaRecorder fully cleared for reset'
          });
        } catch (error) {
          console.error('Error stopping MediaRecorder for reset:', {
            error: error.message,
            timestamp: new Date().toISOString()
          });
          this.setState({
            debugMessage: `Error stopping MediaRecorder for reset: ${error.message}`
          });
        }
      }
      this.audioChunksRef.current = [];
      this.setState({
        interimText: '',
        finalText: '',
        isListening: false,
        showModal: true,
        canRespeak: true,
        transcriptBuffer: []
      });
      this.isStartingRef.current = false;
      this.isStoppingRef.current = false;
      console.log('Reset recording completed', {
        isStarting: this.isStartingRef.current,
        isStopping: this.isStoppingRef.current,
        isListening: this.state.isListening,
        timestamp: new Date().toISOString()
      });
    });
    _defineProperty(this, "handleRespeak", event => {
      event.preventDefault();
      event.stopPropagation();
      console.log('Respeak initiated', {
        isStarting: this.isStartingRef.current,
        isStopping: this.isStoppingRef.current,
        isListening: this.state.isListening,
        timestamp: new Date().toISOString()
      });
      this.setState({
        debugMessage: 'Respeak initiated',
        interimText: '',
        finalText: '',
        transcriptBuffer: [],
        isListening: false,
        canRespeak: false
      });
      this.resetRecording();
      if (!this.isStoppingRef.current && !this.isStartingRef.current && !this.state.isListening) {
        console.log('Starting new recording after respeak', {
          timestamp: new Date().toISOString()
        });
        this.setState({
          isListening: true,
          showModal: true,
          canRespeak: false
        });
        this.handleAudioSearch(true);
      } else {
        console.log('Respeak ignored: recording or cleanup in progress', {
          isStopping: this.isStoppingRef.current,
          isStarting: this.isStartingRef.current,
          isListening: this.state.isListening,
          timestamp: new Date().toISOString()
        });
        this.setState({
          debugMessage: 'Respeak ignored: recording or cleanup in progress',
          canRespeak: true
        });
      }
    });
    this.state = {
      isListening: false,
      showModal: false,
      interimText: '',
      finalText: '',
      debugMessage: '',
      canRespeak: false,
      transcriptBuffer: []
    };
    this.mediaRecorder = /*#__PURE__*/React.createRef();
    this.streamRef = /*#__PURE__*/React.createRef();
    this.audioChunksRef = /*#__PURE__*/React.createRef();
    this.isStoppingRef = /*#__PURE__*/React.createRef();
    this.isStartingRef = /*#__PURE__*/React.createRef();
    this.recognitionRef = /*#__PURE__*/React.createRef();
    this.recordingTimeoutRef = /*#__PURE__*/React.createRef();
    this.speechDetectionTimeoutRef = /*#__PURE__*/React.createRef();
    this.interimTimeoutRef = /*#__PURE__*/React.createRef();
    this.audioChunksRef.current = [];
    this.isStoppingRef.current = false;
    this.isStartingRef.current = false;
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleEscKey);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEscKey);
    console.log('AudioSearch unmounting, triggering cleanup', {
      timestamp: new Date().toISOString()
    });
    this.handleStopRecording();
    this.stopAllTracks();
    if (this.recognitionRef.current) {
      this.recognitionRef.current.onresult = null;
      this.recognitionRef.current.onerror = null;
      this.recognitionRef.current.onend = null;
      this.recognitionRef.current = null;
    }
    this.clearAllTimeouts();
  }
  render() {
    // console.log('AudioSearch render', { 
    //   showModal: this.state.showModal, 
    //   isListening: this.state.isListening, 
    //   refs: { isStarting: this.isStartingRef.current, isStopping: this.isStoppingRef.current }, 
    //   timestamp: new Date().toISOString(),
    // });
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => this.handleAudioSearch(true),
      className: `mic-btn border ${this.props.searchLabel} ${this.state.isListening || this.isStartingRef.current || this.isStoppingRef.current ? 'bg-gray-300' : 'bg-white'} hover:bg-gray-100`,
      disabled: this.state.isListening || this.isStartingRef.current || this.isStoppingRef.current
      // disabled={this.state.isListening}
      ,
      "aria-label": "Voice search"
    }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      icon: faMicrophone
    })), this.state.showModal && /*#__PURE__*/React.createElement("div", {
      className: "voice-modal show",
      tabIndex: "-1",
      "aria-labelledby": "voiceSearchModalLabel",
      "aria-modal": "true",
      role: "dialog"
    }, /*#__PURE__*/React.createElement("div", {
      className: "modal-dialog modal-dialog-centered modal-lg"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mx-modal-content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mx-modal-header"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mx-modal-title",
      id: "voiceSearchModalLabel"
    }, "Voice Search"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn-close",
      onClick: this.handleStopRecording,
      "aria-label": "Close",
      disabled: this.isStoppingRef.current
    })), /*#__PURE__*/React.createElement("div", {
      className: "modal-body"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-gray-700 mb-4 text-base"
    }, this.state.finalText || this.state.interimText || 'Listening...'), process.env.NODE_ENV === 'development' && this.state.debugMessage && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-gray-500 mt-2 break-words"
    }, "Output: ", this.state.debugMessage)), /*#__PURE__*/React.createElement("div", {
      className: "mx-modal-footer btn-modal-search"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: event => {
        event.stopPropagation();
        console.log('Search button clicked', {
          finalText: this.state.finalText,
          interimText: this.state.interimText,
          transcriptBuffer: this.state.transcriptBuffer,
          timestamp: new Date().toISOString()
        });
        if (this.state.finalText) {
          const searchText = this.state.finalText;
          this.props.onTextUpdate(searchText);
          // let url = this.props.exploreCourseUrl + `/search?text=${encodeURIComponent(searchText)}`;
          // window.location = url;
          // this.handleStopRecording();
          if (this.props.exploreCourseUrl) {
            const url = `${this.props.exploreCourseUrl}/search?text=${encodeURIComponent(searchText)}`;
            console.log('Redirecting to:', url, {
              timestamp: new Date().toISOString()
            });
            window.location = url;
          } else {
            console.log('No redirection, closing modal', {
              timestamp: new Date().toISOString()
            });
            this.handleStopRecording();
          }
        }
      },
      className: "btn"
      // disabled={!this.state.finalText && !this.state.interimText}
      ,
      disabled: !this.state.finalText,
      "aria-label": "Search with transcribed text"
    }, "Search"), /*#__PURE__*/React.createElement("button", {
      onClick: this.handleRespeak,
      className: "btn",
      disabled: !this.state.canRespeak,
      "aria-label": "Respeak"
    }, "Respeak"))))));
  }
}
export default AudioSearch;
//# sourceMappingURL=AudioSearch.js.map