<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Game extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->output->set_content_type('application/json');
	}

	private function readJsonBody() {
		$raw = $this->input->raw_input_stream;
		$decoded = json_decode($raw, true);
		return is_array($decoded) ? $decoded : [];
	}

	private function respond($statusCode, $payload) {
		$this->output->set_status_header($statusCode);
		$this->output->set_output(json_encode($payload));
	}

	// POST /game1/play
	// Body: { "players": [ {"userId": "u1", "number": 0-9, "amount": number }, ... ] }
	public function play_game1() {
		$body = $this->readJsonBody();
		$players = isset($body['players']) && is_array($body['players']) ? $body['players'] : [];
		if (count($players) < 2) {
			return $this->respond(400, [ 'error' => 'At least 2 players required', 'minPlayers' => 2 ]);
		}

		// Aggregate chosen numbers and amounts
		$chosenTotals = array_fill(0, 10, 0);
		$chosenFlags = array_fill(0, 10, false);
		foreach ($players as $p) {
			if (!isset($p['number']) || !isset($p['amount'])) { continue; }
			$num = (int) $p['number'];
			$amt = (float) $p['amount'];
			if ($num < 0 || $num > 9 || $amt < 0) { continue; }
			$chosenTotals[$num] += $amt;
			$chosenFlags[$num] = true;
		}

		// Determine available numbers not chosen
		$unchosen = [];
		for ($i = 0; $i < 10; $i++) {
			if (!$chosenFlags[$i]) { $unchosen[] = $i; }
		}

		if (!empty($unchosen)) {
			// Pick a random unchosen number uniformly
			$generated = $unchosen[array_rand($unchosen)];
		} else {
			// All numbers chosen; pick the number with the least total amount
			$minAmount = null;
			$minNumbers = [];
			for ($i = 0; $i < 10; $i++) {
				$amt = $chosenTotals[$i];
				if ($minAmount === null || $amt < $minAmount) {
					$minAmount = $amt;
					$minNumbers = [$i];
				} elseif ($amt === $minAmount) {
					$minNumbers[] = $i;
				}
			}
			// If tie, pick randomly among them
			$generated = $minNumbers[array_rand($minNumbers)];
		}

		// Winners are players who picked the generated number
		$winners = [];
		foreach ($players as $p) {
			if (isset($p['number']) && (int)$p['number'] === $generated) {
				$winners[] = $p;
			}
		}

		return $this->respond(200, [
			'generatedNumber' => $generated,
			'unchosenNumbers' => $unchosen,
			'leastAmountTotals' => $chosenTotals,
			'winners' => $winners
		]);
	}

	// POST /game2/play
	// Body: { "players": [ {"userId": "u1", "side": "BIG|SMALL", "amount": number }, ... ] }
	public function play_game2() {
		$body = $this->readJsonBody();
		$players = isset($body['players']) && is_array($body['players']) ? $body['players'] : [];
		if (count($players) < 2) {
			return $this->respond(400, [ 'error' => 'At least 2 players required', 'minPlayers' => 2 ]);
		}

		$totalBig = 0.0;
		$totalSmall = 0.0;
		foreach ($players as $p) {
			if (!isset($p['side']) || !isset($p['amount'])) { continue; }
			$side = strtoupper(trim($p['side']));
			$amt = (float) $p['amount'];
			if ($amt < 0) { continue; }
			if ($side === 'BIG') { $totalBig += $amt; }
			elseif ($side === 'SMALL') { $totalSmall += $amt; }
		}

		// Decide range based on which side has lower total amount.
		if ($totalBig === $totalSmall) {
			$generated = rand(0, 9);
		} elseif ($totalSmall < $totalBig) {
			$generated = rand(0, 4); // Favor SMALL when it has less total
		} else {
			$generated = rand(5, 9); // Favor BIG when it has less total
		}

		$winningSide = ($generated >= 5) ? 'BIG' : 'SMALL';

		$winners = [];
		foreach ($players as $p) {
			if (isset($p['side']) && strtoupper(trim($p['side'])) === $winningSide) {
				$winners[] = $p;
			}
		}

		return $this->respond(200, [
			'generatedNumber' => $generated,
			'winningSide' => $winningSide,
			'totalBig' => $totalBig,
			'totalSmall' => $totalSmall,
			'winners' => $winners
		]);
	}
}


