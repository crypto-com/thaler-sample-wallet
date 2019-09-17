use neon::prelude::*;
use neon::register_module;

#[macro_use]
extern crate neon;
extern crate client_common;
extern crate client_rpc;
use client_common::tendermint::Client;
use std::thread;
fn run_program(mut cx: FunctionContext) -> JsResult<JsString> {
    thread::spawn(move || {
        client_rpc::run();
    });
    Ok(cx.string("client-rpc!"))
}
register_module!(mut m, { m.export_function("runProgram", run_program) });
